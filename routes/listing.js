const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")

const Listing = require("../models/listing.js");
const controllersListing = require("../controllers/listings.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });



// index route
router.route("/")
    .get(controllersListing.index)
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(controllersListing.createListing))

// new route
router.get("/new", isLoggedIn, controllersListing.renderNewForm);

router.route("/:id")
    .get(wrapAsync(controllersListing.showListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(controllersListing.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(controllersListing.deleteListing));

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(controllersListing.renderEditForm));

module.exports = router;