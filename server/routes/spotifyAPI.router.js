const axios = require('axios');
const express = require('express');
const router = express.Router();
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

router.get('/:artist', (req, res) => {
    const artist = req.params.artist;
    console.log("Got our artist server side:", artist);
})

module.exports = router;