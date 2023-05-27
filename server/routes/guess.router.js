const pool = require('../modules/pool');
const express = require('express');
const router = express.Router();
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');


  router.post('/setSong', (req, res) => {
      console.log("*********");
      console.log("Our info", req.body);
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
                  console.log('Successfully inserted song into song db:');
            }).catch(dbErr => {
                  console.log("Error connecting to DB:", dbErr);
            })
  })
  
  

//   router.post('/history', (req,res) => {
//         console.log("This is our guess", req.body, "and our user:", req.user);

//       //   * Actually, I need to change this. I need to make a POST to my DB when the original song is chosen, and then in this POST I would just get the ID of the correct song to input into history.
//         const userID = req.user.id;
//         const guess = req.body.guess;

//         const sqlQuery = `
//             INSERT INTO "history" ("user_id", ")
//         `
//         res.send(200)
//   })

  
  module.exports = router;