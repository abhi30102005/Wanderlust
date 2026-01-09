require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const maptiler = require("@maptiler/client");

maptiler.config.apiKey = process.env.MAPTILER_KEY;

main();
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wandernew");
  console.log("DB Connected");

  const listings = await Listing.find({
    "geometry.coordinates": { $size: 0 }
  });

  console.log(`Fixing ${listings.length} listings...`);

  for (let listing of listings) {
    const geoData = await maptiler.geocoding.forward(listing.location, { limit: 1 });

    listing.geometry = {
      type: "Point",
      coordinates: geoData.features[0].geometry.coordinates
    };

    await listing.save();
    console.log("Updated:", listing.title);
  }

  console.log("Done");
  process.exit();
}


