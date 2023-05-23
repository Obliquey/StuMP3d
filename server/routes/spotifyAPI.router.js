const axios = require('axios');
const express = require('express');
const { legacy_createStore } = require('redux');
const { default: logger } = require('redux-logger');

const querystring = require('querystring');
const router = express.Router();
require('dotenv').config();
// const { oAuth } = require('../modules/OAuth-middlware')


// vvvv all my info for spotify API calls vvvv
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
// vvvv stuff specifically for logging the user in vvvv
const redirect_uri = 'http://localhost:5000/callback'
const scope = 'streaming user-read-playback-position';


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
const state = generateRandomString(16);

let configLogin = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=http://localhost:5000/callback`,
  headers: { 
    'Cookie': '__Host-device_id=AQAoZkeT-nU1YJnRR7LdXXJnifEI05WNfTIoJvft1xaOw-JlsMQcGH46R5HzBZ0HiMwK5mTJ_B6uHztZEgfwNfN43UJ_sMlh_Es; __Host-sp_csrf_sid=9b53831edcdb9e8553242f1621c8e5a7c7740e1f10e23afed033e7bbc43dcb5a; __Secure-TPASESSION=AQBSC9xOPz6GSreOHZHEiHd9de5K372t2IACs/WxxKwbzOX0QKu734Jj7ZW64l1kpLaZpMuIpne5TFE2h5PqohcGVRVgrhMRjoQ=; inapptestgroup=; sp_sso_csrf_token=013acda719eb26fa0530e6f82a377045f5473a756731363834383634323730383138; sp_tr=false'
  }
};

router.get('/login', (req, res) => {
  console.log("In /spotify/login, here's hoping");
  // axios({
  //   method: 'GET',
  //   url: `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${redirect_uri}`
  // }).then(response => {
  //   let obj=response.request._redirectable._options.href;
  //   console.log("did we get to the .then?", obj);
  //   res.redirect(obj)
  // }).catch(err => {
  //   console.log("Error connecting to spotify", err);
  // })
  // res.redirect(`https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${redirect_uri}`)
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});



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
  // router.get('/:artist', (req, res) => {
  //   const artist = req.params.artist;
  //   // first, gotta get our access token from Spotify
  //   console.log("Got our artist:", artist);
  //   let token;
  //   axios.request(config)
  //   // first .then response for this axios is the access token
  //   .then((response) => {
  //       token = response.data.access_token;
  //       let items = [];

  //       // then, use the access token to make a request for artist info
  //       return axios({
  //           method: 'GET',
  //           url: `https://api.spotify.com/v1/search?q=${artist}&type=album&include_external=audio&limit=5`,
  //           headers: { 
  //               'Authorization': `Bearer  ${token}`
  //           }
  //       }).catch(err => {
  //           console.log("Something went horribly wrong", err);
  //       })
  //       // second .then res is the return of ^^^^^ this second axios call, which are all the items from Spotify. Now we send those back to the client vvvvvv
  //   }).then(response => {
  //       // getting the ID of a random album from the response, to be used in another query
  //       const albumToGet = response.data.albums.items[getRndInteger(0, response.data.albums.items.length)].id;
  //       console.log("album", response.data.albums.items)

  //       return axios({
  //           method: 'GET',
  //           url: `https://api.spotify.com/v1/albums/${albumToGet}/tracks`,
  //           headers: {
  //               'Authorization': `Bearer  ${token}`
  //           }
  //       })
  //   }).then(response => {
  //       // console.log("Not sure what to call this:", response.data)
  //   })
  //   .catch((error) => {
  //       console.log(error);
  //   });
  // })


module.exports = router;