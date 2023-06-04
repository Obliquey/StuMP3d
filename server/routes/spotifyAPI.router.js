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
router.get('/getArtist', rejectUnauthenticated, async (req, res) => {
  try {
    const artist = req.query.artist;
  const userID = req.user.id;
  // const infoToSend = []

  // fetch our token data from the DB
  const dbRes = await pool.query(`SELECT access_token, token_expires, refresh_token FROM "users" WHERE users.id = $1;`, [userID]);
  let token = dbRes.rows[0].access_token
      let expiry = Number(Date.now() + dbRes.rows[0].token_expires);
      let refreshToken = dbRes.rows[0].refresh_token
      let items = [];

  const response = 
    await axios({
            method: 'GET',
            url: `https://api.spotify.com/v1/search?q=${artist}&type=album&include_external=audio&limit=4`,
            headers: { 
              'Authorization': `Bearer  ${token}`
          }
        })
    
        // * THE PROBLEM IS HERE vvvvv Somehow, this is still adding undefined items to the albumArr. Then, when the random number tries to select one, it can inadvertantly pick the undefined one.
        const albumArr = response.data.albums.items.map(item => {
          if(item.total_tracks > 5 && item !== undefined){
            return item;
          }
        })

        
        let rndmNum = getRndInteger(0, albumArr.length - 1)
        console.log("This is our random number:", rndmNum, "And the length of our array:", albumArr.length);
        // gotta extract the album info of the album FROM WHICH we will pick songs.
        // This is so we can display that information on the recap page
        const checkArtist = () => {
            if(albumArr[rndmNum]?.artists[0]?.name === undefined){
              return artist;
            } else {
              return albumArr[rndmNum].artists[0].name
            }
          };
        
        const artistName = checkArtist();
        console.log("THis is our artist:", artistName, "And what we tried to put in there:", albumArr);
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

  const response2 = 
      await axios({
          method: 'GET',
          url: `https://api.spotify.com/v1/albums/${albumID}/tracks`,
          headers: {
              'Authorization': `Bearer  ${token}`
          }})

        let previewURLS = response2.data.items.map(item => {
          return {URL: item.preview_url, name: item.name};
        })
        let infoToSend = [albumInfo, previewURLS]
        res.send(infoToSend);
  } catch (error) {
    console.log("Error in our /getArtist route in spotifyAPI.router", error);
  }
});


// This will hopefully be the route to refresh our token.
router.get('/refresh_token/:artist', rejectUnauthenticated, async (req, res) => {
  try {
    const userID = req.user.id;
    // only need the artist here to pass it on through once we refresh our token
    const artist = req.params.artist
    // gotta get the refresh token from the DB
    const dbRes = await pool.query('SELECT access_token, refresh_token FROM "users" WHERE users.id = $1;', [userID])

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

    const response = await axios(config);

    if(response.status === 200) {
      let tokenExpires = Number((Date.now() + response.data.expires_in))
      let access_token = response.data.access_token
      
      // if the request to Spotify is successful, we update the User's DB info with the new token and token expiry time
      const dbRes2 = await pool.query(
        `UPDATE "users"
            SET access_token = $1,
                token_expires = $2;
      `, [access_token, tokenExpires])
        console.log("Successfully refreshed our access token");
    }
      res.redirect(`/api/spotify/getArtist/${artist}`)
  } catch (error) {
    console.log("Testing out our async/await function in spotifyAPI router");
  }
});

module.exports = router;