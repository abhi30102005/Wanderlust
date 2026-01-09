const maptilerClient = require("@maptiler/client");

maptilerClient.config.apiKey = process.env.MAP_KEY;

module.exports = maptilerClient;
