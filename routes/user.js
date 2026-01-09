const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/user");

const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const router = express.Router();
const userController = require("../controllers/users");
const user = require("../models/user");

//signup
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(userController.signup);


//login
router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
        userController.login);

router.get("/logout", userController.logout);

module.exports = router;