const axios = require('axios');
const express = require('express');

const querystring = require('querystring');
const router = express.Router();
require('dotenv').config();
// const { oAuth } = require('../modules/OAuth-middlware')


// vvvv all my info for spotify API calls vvvv
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
// vvvv stuff specifically for logging the user in vvvv
const redirect_uri = 'http://localhost:5000/callback'
const stateKey = 'spotify_auth_state';
// function to generate random numbers to select random album/songs, etc
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

const generateRandomString = function(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
// generate random string func ^^^ and then call it to create a STATE that we will use in our authorization call and Spotify will use to check later vvvv
const state = generateRandomString(16);


// This is our call to Spotify to authorize the app with the user
router.get('/login', (req, res) => {
  console.log("In /spotify/login, here's hoping");
  const scope = 'streaming user-read-playback-position';
  // not sure what these are vvv but they seem to be necessary
  res.cookie(stateKey, state);

  // this redirects (imagine that) the user to a Spotify page where they can log in
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
})



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
    // first, gotta get our access token from Spotify
    console.log("Got our artist:", artist);
    let token;
    axios.request(config)
    // first .then response for this axios is the access token
    .then((response) => {
        token = response.data.access_token;
        let items = [];

        // then, use the access token to make a request for artist info
        return axios({
            method: 'GET',
            url: `https://api.spotify.com/v1/search?q=${artist}&type=album&include_external=audio&limit=5`,
            headers: { 
                'Authorization': `Bearer  ${token}`
            }
        }).catch(err => {
            console.log("Something went horribly wrong", err);
        })
        // second .then res is the return of ^^^^^ this second axios call, which are all the items from Spotify. Now we send those back to the client vvvvvv
    }).then(response => {
        // getting the ID of a random album from the response, to be used in another query
        const albumToGet = response.data.albums.items[getRndInteger(0, response.data.albums.items.length)].id;
        console.log("album", response.data.albums.items)

        return axios({
            method: 'GET',
            url: `https://api.spotify.com/v1/albums/${albumToGet}/tracks`,
            headers: {
                'Authorization': `Bearer  ${token}`
            }
        })
    }).then(response => {
        console.log("Not sure what to call this:", response.data)
    })
    .catch((error) => {
        console.log(error);
    });
  })


module.exports = router;