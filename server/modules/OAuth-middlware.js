require('dotenv').config();
const axios = require('axios');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

// Need to figure out how to make this middleware.
const oAuth = (req, res, next) => {
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://accounts.spotify.com/api/token?grant_type=client_credentials&client_id=c61b1203a2ba4221b738940903323954&client_secret=b0eb2fe234e144c49e64030ebbfabedf',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded', 
          'Cookie': '__Host-device_id=AQAoZkeT-nU1YJnRR7LdXXJnifEI05WNfTIoJvft1xaOw-JlsMQcGH46R5HzBZ0HiMwK5mTJ_B6uHztZEgfwNfN43UJ_sMlh_Es; sp_tr=false'
        }
      };
      
      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });

} 

 
module.export = {oAuth};