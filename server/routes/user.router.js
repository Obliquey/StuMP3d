const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/user', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  const user = {
    id: req.user.id, 
    username: req.user.username, 
    current_score: req.user.current_score,
    current_streak: req.user.current_streak
  }
  
  res.send(user);
});


router.get('/history/:id', (req, res) => {
  const userID = req.params.id;

  let sqlText = `
  SELECT songs.id AS song_id, song_name, artist, album, cover_art, year_released, correctly_guessed, history.timestamp AS ts FROM "history"
      JOIN "songs"
        ON history.song_id = songs.id
      JOIN "users"
        ON history.user_id = users.id
      WHERE users.id = $1
      ORDER BY ts DESC
      LIMIT 10;
  `;

  pool.query(sqlText, [userID])
      .then(dbRes => {
        console.log("Got our user's history!:", dbRes.rows);
        res.send(dbRes.rows);
      }).catch(dbErr => {
        console.log("Error connecting to the DB:", dbErr);
      })
})

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);

  const queryText = `INSERT INTO "users" (username, password)
    VALUES ($1, $2) RETURNING id`;
  pool
    .query(queryText, [username, password])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log('User registration failed: ', err);
      res.sendStatus(500);
    });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
