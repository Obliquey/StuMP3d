const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

// *Stuff needed for Spotify madness*
const cors = require('cors')
const cookieparser = require('cookie-parser');

const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route includes
const userRouter = require('./routes/user.router');
const spotifyRouter = require('./routes/spotifyAPI.router')
const spotifyOAuth = require('./routes/spotifyOAuth.router')
const guessRouter = require('./routes/guess.router')


// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
// route for making API calls specifically for getting song data vvvv
app.use('/api/spotify', spotifyRouter);
// route for all OAuth flow stuff vvvv
app.use('/api/spotifyOAuth', spotifyOAuth);
// route to control guesses
app.use('/api/guess', guessRouter)
// Serve static files
app.use(express.static('build')).use(cors()).use(cookieparser());


// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
