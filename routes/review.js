const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const Course = require("../models/course.js");
const wrapAsync = require("../utils/wrapAsync");
const {
  validateReview,
  isReviewOwner,
  isLogedIn,
} = require("../utils/middleware.js");

// Post Review Rought
router.post(
  "/",
  isLogedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    try {
      const { courseId } = req.params;
      const review = req.body.review;
      const course = await Course.findById(req.params.courseId);

      if (!course) {
        // Handle invalid course ID
        req.flash("error", "Course not found");
        return res.redirect("/courses"); // Pass to error handler
      }
      const courseReview = new Review(review);

      course.reviews.push(courseReview);

      courseReview.author = req.user._id;

      await courseReview.save();
      await course.save();

      req.flash("success", "Review Added!");
      res.redirect(`/courses/${courseId}`);
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/courses");
    }
  })
);

// Destroy Rought
router.delete(
  "/:reviewId",
  isLogedIn,
  isReviewOwner,
  wrapAsync(async (req, res) => {
    let { courseId, reviewId } = req.params;
    await Course.findByIdAndUpdate(courseId, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");
    res.redirect(`/courses/${courseId}`);
  })
);

module.exports = router;
