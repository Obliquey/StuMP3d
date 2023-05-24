// ****This is our router for user authorization with Spotify****

const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const router = express.Router();
const cookieparser = require('cookie-parser');
require('dotenv').config();
// const { oAuth } = require('../modules/OAuth-middlware')


// vvvv all my info for spotify API calls vvvv
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
// vvvv stuff specifically for logging the user in vvvv
const redirect_uri = 'http://localhost:5000/api/spotifyOAuth/callback'
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
router.get('/login', cookieparser(), (req, res) => {
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
});


router.get('/callback', cookieparser(), function (req, res) {
    console.log('Gimme my callback func');
    // request refresh and access tokens after comparing states
    // res.redirect('http://localhost:3000/#/user')
    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[stateKey] : null;
    console.log("Checking some necessary info, here's our code:", code, "and spotify's state:", state, "and our stored state:", storedState, "and our req.cookies:", req.cookies);
    
    // vvvv this if statement correctly checks state with Spotify's returned state, making sure what we got back from them wasn't hacking of any sort vvvv
    if (state === null || state !== storedState) {
      // I'll need to change this to a proper redirect page, same with line 119
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
      // the check went well, so now we run our call for our tokens!
        res.clearCookie(stateKey); // eat (clear) cookie
      console.log("In else{} statement in /callback");
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://accounts.spotify.com/api/token?grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded', 
          'Cookie': '__Host-device_id=AQAoZkeT-nU1YJnRR7LdXXJnifEI05WNfTIoJvft1xaOw-JlsMQcGH46R5HzBZ0HiMwK5mTJ_B6uHztZEgfwNfN43UJ_sMlh_Es; sp_tr=false'
        }
      };
  
        axios(config) // make request to token endpoint for our tokens
            .then((response) => {
              console.log("Probably not gonna get here, but in .then() statement in our token request", response.data);
                if (response.status === 200) {
                    response.json().then((data) => {
                        let access_token = data.access_token
                        let refresh_token = data.refresh_token
                        console.log("*****************");
                        console.log("*****************");
                        console.log("*****************");
                        console.log("*****************");
                        console.log("*****************");
                        console.log("*****************");
                        console.log("Here are our tokens:", access_token, "And our refresh token:", refresh_token);
  
                        // I'll need to change this redirect to the play page, if the tokens came back properly. I suppose I'll need to post the tokens into the DB too
  
                        // res.redirect('/#' +
                        //     querystring.stringify({
                        //         access_token: access_token,
                        //         refresh_token: refresh_token
                        //     }));
                    });
                } else {
                    res.redirect('/#' +
                        querystring.stringify({
                            error: 'invalid_token'
                        }));
                };
            })
            .catch(error => {
                console.error("Error with axios call for tokens:", error);
            });
    }
  });

module.exports = router;