const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { wrapAsync } = require("../utils/wrapAsync.js");

// Sign In Rought
router.get("/signin", (req, res) => {
  res.render("user/signin.ejs");
});

// Sign In Post Rought
router.post("/signin", async (req, res, next) => {
  try {
    // let newUser = req.body.user;
    let { username, email, password } = req.body.user;
    let user = new User({ username, email });

    let registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) {
        next(err);
      }

      req.flash("success", "Welcome on Future Academy!");
      res.redirect("/courses");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signin");
  }
});

// Login Rought
router.get("/login", (req, res) => {
  res.render("user/login.ejs");
});

// Login Post Rought
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    // console.log(req.user);
    req.flash("success", "Welcome back to Future Academy!");
    res.redirect("/courses");
  }
);

// Logout Rought
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }

    req.flash("success", "Logout successfully!");
    res.redirect("/courses");
  });
});

// Users Rought
router.get(
  "/users/:id/learnings",
  wrapAsync((req, res, next) => {
    res.send("your learning learings");
  })
);

module.exports = router;
