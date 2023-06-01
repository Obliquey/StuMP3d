const pool = require('../modules/pool');
const express = require('express');
const router = express.Router();
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');


//   this route is for inserting the newly chosen song into the songs table, where a list of all listened-to songs will be kept
  router.post('/setSong', rejectUnauthenticated, async (req, res) => {
      try {
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

            const dbRes = await pool.query(sqlQuery, sqlValues)
            res.sendStatus(201)
      } catch (error) {
            console.log("Error in /setSong, guess.router", error);
      }
  })
  
  
// This route is for inserting the outcome of a guess by the user into the history table
// as well as formulating the score and updating the user's score
// * Should refactor this with async / await syntax
  router.post('/guess', rejectUnauthenticated, async (req,res) => {
      try {
            const userID = req.user.id;
            const guess = req.body.songInfo.guess;
            const song = req.body.songInfo.correctSong.name;

            const dbRes = await pool.query(`SELECT * FROM "songs" WHERE song_name = '${song}';` )

            let sqlText = `
                        INSERT INTO "history" ("user_id", "song_id", "correctly_guessed", "timestamp")
                        VALUES
                        ($1, $2, $3, NOW());
                  `;
            let sqlValues = [userID, dbRes.rows[0].id, guess]

            const dbRes2 = await pool.query(sqlText, sqlValues)

            const dbRes3 = await pool.query(`SELECT current_score AS score, current_streak AS streak FROM "users"
            WHERE users.id = $1;`, [userID])

            let score = Number(dbRes3.rows[0].score);
            let streak = Number(dbRes3.rows[0].streak);

            if (guess === true) {
                  try {
                        streak++;
                        score += (10 * streak);

                        const dbRes4 = await pool.query(`UPDATE "users" SET current_score = $1, current_streak = $2 RETURNING current_score, current_streak;`, [score, streak]);
                        console.log("Successfully updated DB with new score/streak:", dbRes4.rows);
                        res.sendStatus(201);
                  } catch (error) {
                        console.log("Error updating DB with new score/streak:", error);
                        res.sendStatus(500);
                  }
                        
            } else if (guess === false) {
                  try {
                        streak = 0;
                        score = (score - 10);

                        const dbRes5 = await pool.query(`UPDATE "users" SET current_score = $1, current_streak = $2 RETURNING current_score, current_streak;`, [score, streak]);
                        console.log("Successfully updated DB with new score/streak:", dbRes5.rows);
                        res.sendStatus(201);
                  } catch (error) {
                        console.log("Error updating DB with new score/streak:", dbErr);
                        res.sendStatus(500);
                  }
            }
      } catch (error) {
            console.log("Error in try/catch statement in /guess, guess.router", error);
      }
      
  });

  
  module.exports = router;