const axios = require('axios');
const express = require('express');
const { default: logger } = require('redux-logger');
const router = express.Router();
require('dotenv').config();
// const { oAuth } = require('../modules/OAuth-middlware')

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `https://accounts.spotify.com/api/token?grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Cookie': '__Host-device_id=AQAoZkeT-nU1YJnRR7LdXXJnifEI05WNfTIoJvft1xaOw-JlsMQcGH46R5HzBZ0HiMwK5mTJ_B6uHztZEgfwNfN43UJ_sMlh_Es; sp_tr=false'
    }
  };
  
  router.get('/:artist', (req, res) => {
    const artist = req.params.artist;
    // first, gotta get our access token from Spotify
    console.log("Got our artist:", artist);
    axios.request(config)
    .then((response) => {
        const token = response.data.access_token;
        let items = [];

        axios({
            method: 'GET',
            url: `https://api.spotify.com/v1/search?q=${artist}&type=album&include_external=audio&limit=5`,
            headers: { 
                'Authorization': `Bearer  ${token}`
            }
        }).then(res => {
            console.log("did we get our artist information? ===> ", res.data.albums.items);
            items.push(res.data.albums.items);
        }).catch(err => {
            console.log("Something went horribly wrong", err);
        })
        res.send(items);
    })
    .catch((error) => {
        console.log(error);
    });
  })


module.exports = router;