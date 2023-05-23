const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const axios = require('axios');
const spotifyRouter = require('./routes/spotifyAPI.router')

const app = express();
const cors = require('cors')
const cookieparser = require('cookie-parser');
const querystring = require('querystring');

const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route includes
const userRouter = require('./routes/user.router');


// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
// vvvv stuff specifically for logging the user in vvvv
const redirect_uri = 'http://localhost:5000/callback'
const stateKey = 'spotify_auth_state';
const generateRandomString = function(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

/* Routes */
app.use('/api/user', userRouter);
app.use('/api/spotify', spotifyRouter);


// app.get('/api/spotify/login', cors(), (req, res) => {
//   console.log("In /spotify/login, here's hoping");
//   axios({
//     method: 'GET',
//     url: `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${redirect_uri}`
//   }).then(response => {
//     let obj=response.request._redirectable._options.href;
//     console.log("did we get to the .then?", obj);
//     res.redirect(obj)
//   }).catch(err => {
//     console.log("Error connecting to spotify", err);
//   })
// })


// app.get('/callback', function (req, res) {
//   console.log('Gimme my callback func');
//   // request refresh and access tokens after comparing states

//   let code = req.query.code || null;
//   let state = req.query.state || null;
//   let storedState = req.cookies ? req.cookies[stateKey] : null;

//   if (state === null || state !== storedState) {
//       res.redirect('/#' +
//           querystring.stringify({
//               error: 'state_mismatch'
//           }));
//   } else {
//       res.clearCookie(stateKey); // eat (clear) cookie

//       const authOptions = {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/x-www-form-urlencoded',
//               'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
//           },
//           body: `code=${code}&redirect_uri=${redirect_uri}&grant_type=authorization_code`,
//           json: true
//       };

//       axios('https://accounts.spotify.com/api/token', authOptions) // make request to token endpoint for our tokens
//           .then((response) => {
//               if (response.status === 200) {
//                   response.json().then((data) => {
//                       let access_token = data.access_token
//                       let refresh_token = data.refresh_token
//                       res.redirect('/#' +
//                           querystring.stringify({
//                               access_token: access_token,
//                               refresh_token: refresh_token
//                           }));
//                   });
//               } else {
//                   res.redirect('/#' +
//                       querystring.stringify({
//                           error: 'invalid_token'
//                       }));
//               };
//           })
//           .catch(error => {
//               console.error(error);
//           });
//   }
// });



// Serve static files
app.use(express.static('build')).use(cors()).use(cookieparser());

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
