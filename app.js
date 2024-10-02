const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();
const port = 8080;

const sessionOptions = {
  secret: "mytopsecreatcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: +7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); // Before using password we have to initilize it.
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); // It will make sure to add the user.
passport.serializeUser(User.serializeUser()); // It is use to store user on session aaafter Sign-in/Log-in.
passport.deserializeUser(User.deserializeUser());
// app.use(methodOverride("_method"));

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
  next();
});

// Root Rought
app.get("/", (req, res) => {
  res.send("Welcome to root");
});

// Index Rought
app.get("/home", (req, res) => {
  res.render("index.ejs");
});

app.get("/signin", (req, res) => {
  res.render("signin.ejs");
});

app.post("/signin", async (req, res) => {
  let { username, password, email } = req.body;
  // console.log({ username, password, email });

  let user = new User({
    username,
    password,
    email,
  });

  let registeredUser = await User.register(user, password);
  console.log(registeredUser);

  res.send("working");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    console.log(req.user);
    req.flash("success", "Welcome back to Future Academy!");
    console.log(res.locals.currentUser);
    res.redirect("/home");
  }
);

app.use("*", (req, res) => {
  res.render("error.ejs");
});

app.listen(port, () => {
  console.log(`app is listening at port: ${port}`);
});
