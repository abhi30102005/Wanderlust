if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}


const express = require("express");
const app = express();

const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

const ExpressError = require("./utils/ExpressError.js");

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");


const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash")

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { env } = require("process");

// const MONGO_URL="mongodb://127.0.0.1:27017/wandernew";

const dbUrl = process.env.ATLASDB_URL;

main().then((res) => {
    console.log("connection successful with db");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect(dbUrl);
};


const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: process.env.SECRET,
    touchAfter: 24 * 3600,
})

store.on("error", (err) => {
    console.log("error in mongo session session store", err)
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong";

    res.status(statusCode);
    return res.render("error.ejs", { message: err.message });
});


app.listen(8080, () => {
    console.log("listning to the port 8080");
});