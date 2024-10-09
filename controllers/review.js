const Review = require("../models/review.js");
const Course = require("../models/course.js");
const wrapAsync = require("../utils/wrapAsync");

// Post Review Rought
module.exports.postReviewRought = wrapAsync(async (req, res) => {
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
});

// Destroy Rought
module.exports.destroyRought = wrapAsync(async (req, res) => {
  let { courseId, reviewId } = req.params;
  await Course.findByIdAndUpdate(courseId, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted!");
  res.redirect(`/courses/${courseId}`);
});
