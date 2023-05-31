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
// Also refactor everything out to not include singles/EP's
router.get('/getArtist', (req, res) => {
  const artist = req.query.artist;
  const userID = req.user.id;
  // const infoToSend = []

  // fetch our token data from the DB
  pool.query(`SELECT access_token, token_expires, refresh_token FROM "users" WHERE users.id = $1;`, [userID])
  .then((dbRes) => {
    // extract it
      let token = dbRes.rows[0].access_token
      let expiry = Number(Date.now() + dbRes.rows[0].token_expires);
      let refreshToken = dbRes.rows[0].refresh_token
      let items = [];

        // API call for the searched artist, which we will extract the album id from
        return axios({
          method: 'GET',
          url: `https://api.spotify.com/v1/search?q=${artist}&type=album&include_external=audio&limit=4`,
          headers: { 
              'Authorization': `Bearer  ${token}`
          }
      }).then((response) => {

        // need to weed out singles, etc
        const albumArr = response.data.albums.items.map(item => {
          if(item.total_tracks > 5){
            return item;
          }
        })

        
        let rndmNum = getRndInteger(0, albumArr.length)
        console.log("*********************");
        console.log("*********************");
        console.log("*********************");
        console.log("*********************");
        console.log("*********************");
        console.log("This is our response:", albumArr[rndmNum].artists);

        // gotta extract the album info of the album FROM WHICH we will pick songs.
        // This is so we can display that information on the recap page
        // *this is what I need to refactor. I can't choose any album that has total_tracks < 4
        const artistName = albumArr[rndmNum].artists[0].name;
        const albumID = albumArr[rndmNum].id;
        const coverArt = albumArr[rndmNum].images;
        const releaseDate = albumArr[rndmNum].release_date;
        const albumName = albumArr[rndmNum].name;
        const albumInfo = {
          artist: artistName,
          albumID: albumID,
          coverArt: coverArt,
          releaseDate: releaseDate,
          albumName: albumName
        }

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

          // * Something is happening with our calls to Spotify. I need to restrict it so that I don't get singles, but even with full albums we are still getting undefined songs
          // * for our choices. Somewhere along the path of getting our songs to the front end we are losing info.

          console.log("Checking what we're getting from Spotify, line:",85, response.data);

          let previewURLS = response.data.items.map(item => {
            return {URL: item.preview_url, name: item.name};
          })
          let infoToSend = [albumInfo, previewURLS]
          res.send(infoToSend);


          // Don't mind these cascading catches
        }).catch(err => {
          console.log("Error making GET req to Spotify for albums", err);
        })
      }).catch(err => {
        console.log("Error making GET req to Spotify for artist", err);
        // If there is an error with our token access call to Spotify, this error will proc and we will go to refresh the token
        res.redirect(`/api/spotify/refresh_token/${artist}`)
      })
    }).catch(dbErr => {
      console.log("Error connecting to DB:", dbErr);
    })
});


// This will hopefully be the route to refresh our token.
router.get('/refresh_token/:artist', (req, res) => {
  const userID = req.user.id;
  const artist = req.params.artist
  // gotta get the refresh token from the DB
  pool.query('SELECT access_token, refresh_token FROM "users" WHERE users.id = $1;', [userID])
      .then(dbRes => {
        
        // now we gotta use it in another request to the Spotify API to ask for another access token
        const refresh_token = dbRes.rows[0].refresh_token;

        const config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `https://accounts.spotify.com/api/token?grant_type=refresh_token&refresh_token=${refresh_token}`,
          headers: { 
              'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded', 
            'Cookie': '__Host-device_id=AQAoZkeT-nU1YJnRR7LdXXJnifEI05WNfTIoJvft1xaOw-JlsMQcGH46R5HzBZ0HiMwK5mTJ_B6uHztZEgfwNfN43UJ_sMlh_Es; sp_tr=false'
          }
        };

        // **GOTTA FIGURE OUT HOW To CONFIGURE THIS AXIOS CALL vvvvvvvvvvv

        // This is our call to Spotify to refresh our access token.
        axios(config)
          .then((response) => {
            if(response.status === 200) {
            let tokenExpires = Number((Date.now() + response.data.expires_in))
            let access_token = response.data.access_token
            
            // if the request to Spotify is successful, we update the User's DB info with the new token and token expiry time
            pool.query(
              `UPDATE "users"
                  SET access_token = $1,
                      token_expires = $2;
            `, [access_token, tokenExpires]
            ).then(dbRes => {
              // if that's successful, we then send the user (unbeknownst to them) back to the /getArtist route, along with their original searched artist.
              console.log("Successfully updated the database with new Access token");
              res.redirect(`/api/spotify/getArtist/${artist}`)
            }).catch(dbErr => {
              console.log("Error connecting with DB in /refresh_token", dbErr);
            })
          } else {
            console.log("Something went wrong when asking Spotify to refresh token in /refresh_token, spotifyAPI.router", response.status);
          }
          }).catch(err => {
            console.log("Something went wrong when using our refresh token", err);
          })
  })
})

module.exports = router;