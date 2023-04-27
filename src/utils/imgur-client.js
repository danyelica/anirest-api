const { default: ImgurClient } = require("imgur");

const client = new ImgurClient({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
});

module.exports = client;
