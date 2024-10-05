const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { wrapAsync } = require("../utils/wrapAsync.js");

router.get("/signin", (req, res) => {
  res.render("user/signin.ejs");
});

router.post("/signin", async (req, res, next) => {
  try {
    let newUser = req.body.user;

    let user = new User({ ...user });

    let registeredUser = await User.register(user, newUser.password);

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

router.get("/login", (req, res) => {
  res.render("user/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    // console.log(req.user);
    req.flash("success", "Welcome back to Future Academy!");
    // res.locals.currentUser = req.user;
    console.log(res.locals.currentUser);
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

router.get(
  "/users/:id/learnings",
  wrapAsync((req, res, next) => {
    res.send("your learning learings");
  })
);

module.exports = router;
