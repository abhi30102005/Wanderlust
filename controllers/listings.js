const Listing = require("../models/listing");
const maptiler = require("../utils/maptiler");
//index
module.exports.index = async (req, res) => {
    let allListing = await Listing.find();
    res.render("listing/index.ejs", { allListing });
};

//new form 
module.exports.renderNewForm = (req, res) => {
    res.render("listing/new.ejs");
}

//showListing
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "The listing you are trying to access does not exist");
        return res.redirect("/listings");
    }
    res.render("listing/show.ejs", { listing });
};

//createListing
module.exports.createListing = async (req, res, next) => {
    const { location } = req.body.listing;

    const geoData = await maptiler.geocoding.forward(location, {
        limit: 1
    });

    let url = req.file.path;
    let filename = req.file.filename;
    let newlisting = new Listing(req.body.listing);
    newlisting.image = { url, filename };
    // console.log(req.user);
    newlisting.owner = req.user._id;
    newlisting.geometry = geoData.features[0].geometry;
    let savedListing = await newlisting.save();
    // console.log(savedListing);
    req.flash("success", "New listing created!");
    res.redirect("/listings");
};

//edit
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "The listing you are trying to access does not exist");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_150");
    res.render("listing/edit.ejs", { listing, originalImageUrl });
};

//update
module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};