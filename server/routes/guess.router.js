const pool = require('../modules/pool');
const express = require('express');
const router = express.Router();
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');


//   this route is for inserting the newly chosen song into the songs table, where a list of all listened-to songs will be kept
  router.post('/setSong', (req, res) => {
      console.log("***********");
      console.log("***********");
      console.log("***********");
      console.log("***********");
      console.log("Our req.body:", req.body);
      const song = req.body.song.name;
      const coverArt = req.body.albumInfo.coverArt[2].url;
      const releaseDate = req.body.albumInfo.releaseDate;
      const albumName = req.body.albumInfo.albumName
      const artist = req.body.albumInfo.artist;

      const sqlQuery = `
            INSERT INTO "songs" ("song_name", "artist", "album", "cover_art", "year_released")
            VALUES
            ($1, $2, $3, $4, $5);
      `;
      const sqlValues = [song, artist, albumName, coverArt, releaseDate];

      pool.query(sqlQuery, sqlValues)
            .then(dbRes => {
                  res.sendStatus(201)
            }).catch(dbErr => {
                  console.log("Error connecting to DB:", dbErr);
            })
  })
  
  
// This route is for inserting the outcome of a guess by the user into the history table
// as well as formulating the score and updating the user's score
  router.post('/guess', (req,res) => {
      console.log("This is our song", req.body.songInfo.correctSong.name, "and our user:", req.user);
      const userID = req.user.id;
      const guess = req.body.guess;
      const song = req.body.songInfo.correctSong.name;
      const artist = req.body.songInfo.albumInfo.artist;
      const albumName = req.body.songInfo.albumInfo.albumName;
      const coverArt = req.body.songInfo.albumInfo.coverArt[2];
      const releaseDate = req.body.songInfo.albumInfo.releaseDate;

      pool.query(`SELECT * FROM "songs" WHERE song_name = '${song}';` )
            .then(dbRes => {
                  console.log("Did we get the correct song name?", dbRes.rows);

                  let sqlText = `
                        INSERT INTO "history" ("user_id", "song_id", "correctly_guessed", "timestamp")
                        VALUES
                        ($1, $2, $3, NOW());
                  `;
                  let sqlValues = [userID, dbRes.rows[0].id, guess]

                  pool.query(sqlText, sqlValues)
                        .then(dbRes => {
                              res.sendStatus(201)
                        }).catch(dbErr => {
                              console.log("Error connecting to DB:", dbErr);
                        })
            }).catch(dbErr => {
                  console.log("Error connecting to DB:", dbErr);
            })

        res.sendStatus(200)
  })

  
  module.exports = router;