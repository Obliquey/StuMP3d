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
app.use('/api/spotify', spotifyRouter);
app.use('/api/spotifyOAuth', spotifyOAuth)
// Serve static files
app.use(express.static('build')).use(cors()).use(cookieparser());


// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
