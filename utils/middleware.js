const { courseSchema, reviewSchema } = require("../schemaValidation.js");
const Course = require("../models/course.js");
const Review = require("../models/review.js");
const ExpressError = require("./ExpressError.js");

// Verification for User
module.exports.isLogedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You mmust be loged in first!");
    res.redirect("/login");
  }
  next();
};

module.exports.redirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// Verification for Cours ownership
module.exports.isCourseOwner = async (req, res, next) => {
  const { courseId } = req.params;
  const course = await Course.findById(courseId);
  if (
    res.locals.currentUser &&
    !course.author._id.equals(res.locals.currentUser._id)
  ) {
    req.flash("error", "You are not the ower of this course!");
    return res.redirect(`/courses/${courseId}`);
  }
  next();
};

module.exports.isReviewOwner = async (req, res, next) => {
  const { courseId, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (
    res.locals.currentUser &&
    !review.author._id.equals(res.locals.currentUser._id)
  ) {
    req.flash("error", "You are not the ower of this review!");
    return res.redirect(`/courses/${courseId}`);
  }
  next();
};

// Middleware for confirming  wether the the student is not the author of course
module.exports.isCourseAuthor = async (req, res, next) => {
  const { courseId, reviewId } = req.params;
  const course = await Course.findById(courseId);
  if (!course) {
    req.flash("error", "The course you are looking for does not exists!");
    return res.redirect(`/courses`);
  }

  if (!res.locals.currentUser) {
    req.flash("error", "You have to be logged-In first!");
    res.redirect(`/login`);
  }

  if (
    res.locals.currentUser &&
    course.author._id.equals(res.locals.currentUser._id)
  ) {
    req.flash("error", "You cannot buy your own course!");
    return res.redirect(`/courses/${courseId}`);
  }
  next();
};

// Course Schema Validator
module.exports.validateCourse = (req, res, next) => {
  let { error } = courseSchema.validate(req.body);
  if (error) {
    let errorMsg = error.details
      .map((el) => {
        return el.message;
      })
      .join(",");
    req.flash("error", errorMsg);
    throw new ExpressError(400, errorMsg);
  } else {
    next();
  }
};

// Review Schema Validator
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body.reviews);
  if (error) {
    let errorMsg = error.details
      .map((el) => {
        return el.message;
      })
      .join(",");
    req.flash("error", errorMsg);
    throw new ExpressError(400, errorMsg);
  } else {
    next();
  }
};
