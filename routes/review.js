const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const Course = require("../models/course.js");
const { wrapAsync } = require("../utils/wrapAsync");

router.get("/", async (req, res) => {
  try {
    let { id } = req.params;
    let { comment, rating } = req.body;
    console.log({ comment, rating });
    // const course = await Course.findById(id);
    res.send("hello");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/courses");
  }
});

module.exports = router;
