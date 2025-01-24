const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");

const courseRought = require("./routes/course.js");
const userRought = require("./routes/user.js");
const tutorRought = require("./routes/tutor.js");
const reviewRought = require("./routes/review.js");
const ExpressError = require("./utils/ExpressError.js");

const app = express();
const port = 8080;

const sessionOptions = {
  secret: "mytopsecreatcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
    maxAge: +365 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); // Before using password we have to initilize it.
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); // It will make sure to add the user.
passport.serializeUser(User.serializeUser()); // It is use to store user on session aaafter Sign-in/Log-in.
passport.deserializeUser(User.deserializeUser());

app.engine("ejs", ejsMate);

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(`error - ${err}`);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/futureAcademy");
}

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  res.locals.isAlreadyPurchased = false;
  next();
});

// Root Rought
app.get("/", (req, res) => {
  res.render("model.ejs");
});

app.use("/courses", courseRought);
app.use("/", userRought);
app.use("/", tutorRought);
app.use("/courses/:courseId/reviews", reviewRought);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Error handler
app.use((err, req, res, next) => {
  let { statusCode = 400, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
  console.log(` error - ${err}`);
});

app.listen(port, () => {
  console.log(`app is listening at port: ${port}`);
});
