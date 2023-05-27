const pool = require('../modules/pool');
const express = require('express');
const router = express.Router();
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');


  router.post('/setSong', (req, res) => {

  })
  
  
  
  router.post('/history', (req,res) => {
        console.log("This is our guess", req.body, "and our user:", req.user);
        
      //   * Actually, I need to change this. I need to make a POST to my DB when the original song is chosen, and then in this POST I would just get the ID of the correct song to input into history.
        const userID = req.user.id;
        const guess = req.body.guess;

        const sqlQuery = `
            INSERT INTO "history" ("user_id", ")
        `
        res.send(200)
  })


  module.exports = router;