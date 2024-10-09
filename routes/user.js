const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLogedIn, saveRedirectUrl } = require("../utils/middleware.js");
const userConterllers = require("../controllers/user.js");

// Get & Post Sign-In Rought
router
  .route("/signin")
  .get(userConterllers.signin)
  .post(userConterllers.postSigninRought);

router.route("/login").get();

// Get & Post Login Rought
router
  .route("/login")
  .get(userConterllers.getLoginRought)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userConterllers.postLoginRought
  );

// Logout Rought
router.get("/logout", userConterllers.logoutRought);

// Users Rought
router.get("/users/:userId", isLogedIn, userConterllers.userCoursesRought);

module.exports = router;
