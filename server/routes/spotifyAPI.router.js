const axios = require('axios');
const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const userStrategy = require('../strategies/user.strategy');
require('dotenv').config();


// vvvv all my info for spotify API calls vvvv
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
// function to generate random numbers to select random album/songs, etc
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  };


let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `https://accounts.spotify.com/api/token?grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Cookie': '__Host-device_id=AQAoZkeT-nU1YJnRR7LdXXJnifEI05WNfTIoJvft1xaOw-JlsMQcGH46R5HzBZ0HiMwK5mTJ_B6uHztZEgfwNfN43UJ_sMlh_Es; sp_tr=false'
    }
  };



//   will probably want to refactor this at some point so I'm not asking for a new access token every call.
// Also refactor everything out to 
  router.get('/:artist', (req, res) => {
    const artist = req.params.artist;
    const userID = req.user.id;
    // const infoToSend = []
  
    // fetch our token data from the DB
    pool.query(`SELECT access_token, token_expires, refresh_token FROM "users" WHERE users.id = $1;`, [userID])
    .then((dbRes) => {
      // extract it
        const token = dbRes.rows[0].access_token
        const expiry = dbRes.rows[0].token_expires
        const refreshToken = dbRes.rows[0].refresh_token
        let items = [];

        // Then, check if access_token is expired. If it is, we will need to request a new one.
        if(expiry >= Date.now()) {
          // gotta make a new request with the refresh token here, or redirect to a different function to refresh the token.
          console.log("Gotta get a new token!", expiry);
        } else if (expiry < Date.now()) {
          console.log("Token is all good! Ask away");

          // API call for the searched artist, which we will extract the album id from
          return axios({
            method: 'GET',
            url: `https://api.spotify.com/v1/search?q=${artist}&type=album&include_external=audio&limit=5`,
            headers: { 
                'Authorization': `Bearer  ${token}`
            }
        }).then((response) => {
          let rndmNum = getRndInteger(0, response.data.albums.items.length)

          // gotta extract the album info of the album FROM WHICH we will pick songs.
          // This is so we can display that information on the recap page
          const albumID = response.data.albums.items[rndmNum].id;
          const coverArt = response.data.albums.items[rndmNum].images[1];
          const releaseDate = response.data.albums.items[rndmNum].release_date;
          const albumName = response.data.albums.items[rndmNum].name;
          const albumInfo = {
            albumID: albumID,
            coverArt: coverArt,
            releaseDate: releaseDate,
            albumName: albumName
          }
          console.log("album", albumInfo)
  
          // then we need to make the call for the tracks from that album
          return axios({
              method: 'GET',
              url: `https://api.spotify.com/v1/albums/${albumID}/tracks`,
              headers: {
                  'Authorization': `Bearer  ${token}`
              }
          }).then(response => {
            // gotta extract JUST the preview urls and the names of each song
            // These we will return to the client side.
            let previewURLS = response.data.items.map(item => {
              return {URL: item.preview_url, name: item.name};
            })
            console.log("Here's our response?:", previewURLS);
            let infoToSend = [albumInfo, previewURLS]
            res.send(infoToSend);


            // Don't mind these cascading catches
          }).catch(err => {
            console.log("Error making GET req to Spotify for albums", err);
          })
        }).catch(err => {
          console.log("Error making GET req to Spotify for artist", err);
        })
      }}).catch(dbErr => {
        console.log("Error connecting to DB:", dbErr);
      })
  });


module.exports = router;