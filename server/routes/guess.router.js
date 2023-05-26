const pool = require('../modules/pool');
const express = require('express');
const router = express.Router();
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');


  router.post('/', (req,res) => {
        console.log("**********");
        console.log("**********");
        console.log("**********");
        console.log("**********");
        console.log("**********");
        console.log("This is our guess", req.body);
        res.send(200)
  })

  module.exports = router;