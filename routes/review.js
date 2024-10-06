const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const Course = require("../models/course.js");
const wrapAsync = require("../utils/wrapAsync");
const { validateReview } = require("../utils/middleware.js");

router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let course = await Course.findById(req.params.id);
    let courseReview = new Review(req.body.review);

    course.reviews.push(courseReview);
    console.log(course);

    courseReview.author = req.user._id;

    await courseReview.save();
    await course.save();

    req.flash("success", "Review Added!");
    res.redirect(`/courses/${id}/show`);
  })
);

router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Course.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");
    res.redirect(`/courses/${id}/show`);
  })
);

module.exports = router;
