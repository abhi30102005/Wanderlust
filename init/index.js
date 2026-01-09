// const mongoose = require("mongoose");
const data = require("./data.js");
// const Listing = require("../models/listing.js");
// const initData = require("./data.js");

// main().then((res) => {
//     console.log("connection successfull with database");
// }).catch((err) => {
//     console.log(err);
// })

// async function main() {
//     await mongoose.connect("mongodb://127.0.0.1:27017/wandernew");
// }

// const initDb = async () => {
//     await Listing.deleteMany({});
//     initData.data = initData.data.map((obj) => ({ ...obj, owner: '6954f52555b2b78d67a1bc1f' }));
//     await Listing.insertMany(initData.data);
//     console.log("data was initialized");
// };

// initDb();







const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");
const maptiler = require("@maptiler/client");

require("dotenv").config();

maptiler.config.apiKey = process.env.MAP_KEY;

main().then(() => {
    console.log("connection successful with database");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wandernew");
}

console.log(process.env.MAP_KEY);

const initDb = async () => {
    await Listing.deleteMany({});

    const updatedListings = [];

    for (let obj of initData.data) {
        try {
            const geo = await maptiler.geocoding.forward(obj.location, { limit: 1 });

            obj.owner = '6954f52555b2b78d67a1bc1f';
            obj.geometry = {
                type: "Point",
                coordinates: geo.features[0].geometry.coordinates
            };

            updatedListings.push(obj);

        } catch (e) {
            console.log(e);
            obj.geometry = {
                type: "Point",
                coordinates: []
            };
            updatedListings.push(obj);
        }
    }

    await Listing.insertMany(updatedListings);
    console.log("data was initialized with coordinates");
};

initDb();
