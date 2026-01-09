const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
// const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const controllersReview = require("../controllers/reviews.js");

//Review route
router.post("/", isLoggedIn, controllersReview.createReview);

// review delete route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(controllersReview.deleteReview));

module.exports = router;