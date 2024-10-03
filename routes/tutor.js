const express = require("express");
const router = express.Router();
const Tutor = require("../models/tutor.js");
const passport = require("passport");

router.get("/tutor", (req, res) => {
  res.render("tutor.ejs");
});

router.post("/tutor", async (req, res) => {
  try {
    const tutor = req.body.tutor;
    console.log(tutor);

    let registeredTutor = await Tutor.register(tutor, tutor.password);

    req.login(registeredTutor, (err) => {
      if (err) {
        next(err);
      }

      req.flash("success", "Congratulation on becoming a tutor!");
      res.redirect("/courses");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/tutor");
  }
});

module.exports = router;
