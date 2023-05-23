const axios = require('axios');
const express = require('express');
const { legacy_createStore } = require('redux');
const { default: logger } = require('redux-logger');
const router = express.Router();
require('dotenv').config();
// const { oAuth } = require('../modules/OAuth-middlware')

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

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
        // console.log("Not sure what to call this:", response.data)
    })
    .catch((error) => {
        console.log(error);
    });
  })


module.exports = router;