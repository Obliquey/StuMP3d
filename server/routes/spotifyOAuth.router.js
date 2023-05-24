// ****This is our router for user authorization with Spotify****

const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const router = express.Router();
const cookieparser = require('cookie-parser');
const pool = require('../modules/pool');
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');
const userStrategy = require('../strategies/user.strategy');
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
    console.log('Gimme my callback func, here is our user:', req.user);
    // request refresh and access tokens after comparing states
    // res.redirect('http://localhost:3000/#/user')
    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[stateKey] : null;
    
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
        
        // This is the  config for our call for tokens. Feeling kinda like Sonic going after rings, I want tokens so bad
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://accounts.spotify.com/api/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}`,
            headers: { 
                'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
              'Content-Type': 'application/x-www-form-urlencoded', 
              'Cookie': '__Host-device_id=AQAoZkeT-nU1YJnRR7LdXXJnifEI05WNfTIoJvft1xaOw-JlsMQcGH46R5HzBZ0HiMwK5mTJ_B6uHztZEgfwNfN43UJ_sMlh_Es; sp_tr=false'
            }
          };
    
        axios(config) // make request to token endpoint for our tokens
            .then((response) => {
                if (response.status === 200) {

                    let tokenExpires = Number((Date.now() + response.data.expires_in))
                    let access_token = response.data.access_token
                    let refresh_token = response.data.refresh_token
                    let userID = req.user.id;
                    
                    // *Got our tokens! Need to store them in the DB for access later, after determining the expiry time of the access token
                    let sqlText = `UPDATE "users" 
                        SET access_token = $1,
                            refresh_token = $2,
                            token_expires = $3
                        WHERE users.id = $4;
                    `;

                    let sqlValues = [access_token, refresh_token, tokenExpires, userID]
                    pool.query(sqlText, sqlValues)
                        .then(dbRes => {
                            // again, once I get my page flow set up, I'll need to change this redirect vvvv
                            res.redirect('http://localhost:3000/#/user')
                        }).catch(dbErr => {
                            console.log("Error connecting to our DB when storing access token", dbErr);
                        })

                        
                        // *After successfully receiving our tokens, need to redirect to the User Login page / play page if they are logged in
                    //    res.redirect('some kind of user page')
                } else {
                    // maybe make some kind of error page to redirect to, that takes the error message and makes a popup?
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