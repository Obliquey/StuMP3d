const pool = require('../modules/pool');
const express = require('express');
const router = express.Router();
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');


//   this route is for inserting the newly chosen song into the songs table, where a list of all listened-to songs will be kept
  router.post('/setSong', (req, res) => {
      const song = req.body.song.name;
      const coverArt = req.body.albumInfo.coverArt[2].url;
      const releaseDate = req.body.albumInfo.releaseDate;
      const albumName = req.body.albumInfo.albumName
      const artist = req.body.albumInfo.artist;

      const sqlQuery = `
            INSERT INTO "songs" ("song_name", "artist", "album", "cover_art", "year_released")
            VALUES
            ($1, $2, $3, $4, $5)
            ON CONFLICT ("song_name") DO NOTHING;
      `;
      const sqlValues = [song, artist, albumName, coverArt, releaseDate];

      pool.query(sqlQuery, sqlValues)
            .then(dbRes => {
                  res.sendStatus(201)
            }).catch(dbErr => {
                  console.log("Error connecting to DB in /setSong, guess router:", dbErr);
            })
  })
  
  
// This route is for inserting the outcome of a guess by the user into the history table
// as well as formulating the score and updating the user's score
  router.post('/guess', (req,res) => {
      const userID = req.user.id;
      const guess = req.body.songInfo.guess;
      const song = req.body.songInfo.correctSong.name;

      pool.query(`SELECT * FROM "songs" WHERE song_name = '${song}';` )
            .then(dbRes => {

                  let sqlText = `
                        INSERT INTO "history" ("user_id", "song_id", "correctly_guessed", "timestamp")
                        VALUES
                        ($1, $2, $3, NOW());
                  `;
                  let sqlValues = [userID, dbRes.rows[0].id, guess]

                  pool.query(sqlText, sqlValues)
                        .then(dbRes => {
                              // this is actually processed AFTER line 60, surprisingly. so this sendStatus is the final word on how this function went
                              res.sendStatus(200)
                        }).catch(dbErr => {
                              console.log("Error connecting to DB in /guess, guess router:", dbErr);
                        })

                  // * This is where the points will be scored. First, I need to get the user's current streak and current score
                  // * Then, I need to add the score from the current guess (either adding or subtracting 10, depending if the guess was correct/incorrect)
                  // * Then, update the streak +/- 1
                  // * Finally, update the table with the now-current info
                  pool.query(`SELECT current_score AS score, current_streak AS streak FROM "users"
                  WHERE users.id = $1;`, [userID])
                        .then(dbRes => {
                              // extract the user's score and streak
                              let score = Number(dbRes.rows[0].score);
                              let streak = Number(dbRes.rows[0].streak);
                              
                              // then conditionally update those, depending on the guess status, with the user's new points
                              if (guess === true) {
                                    streak++;
                                    score += (10 * streak);

                                    pool.query(`UPDATE "users" SET current_score = $1, current_streak = $2 RETURNING current_score, current_streak;`, [score, streak])
                                          .then(dbRes => {
                                                console.log("Successfully updated DB with new score/streak:", dbRes.rows);
                                          }).catch(dbErr => {
                                                console.log("Error updating DB with new score/streak:", dbErr);
                                          })
                                          
                              } else if (guess === false) {
                                    streak = 0;
                                    score = (score - 10);

                                    pool.query(`UPDATE "users" SET current_score = $1, current_streak = $2 RETURNING current_score, current_streak;`, [score, streak])
                                          .then(dbRes => {
                                                console.log("Successfully updated DB with new score/streak:", dbRes.rows);
                                          }).catch(dbErr => {
                                                console.log("Error updating DB with new score/streak:", dbErr);
                                          })
                              }

                        }).catch(dbErr => {
                              console.log("Error retrieving user's score and streak in /guess, guess.router", dbErr);
                        })

            }).catch(dbErr => {
                  console.log("Error connecting to DB in /guess, guess router:", dbErr);
            })

  })

  
  module.exports = router;