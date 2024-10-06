const { courseSchema, reviewSchema } = require("../schemaValidation.js");
const Course = require("../models/course.js");
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
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let course = await Course.findById(id);
  if (
    req.locals.currentUser &&
    !course.author._id.equals(res.locals.currentUser._id)
  ) {
    req.flash("eror", "You are not the ower of this course!");
    return res.redirect(`/courses/${id}/show`);
  }
  next();
};

// Course Schema Validator
module.exports.validateCourse = (req, res, next) => {
  let { error } = courseSchema.validate(req.body);
  if (error) {
    let errorMsg = error.details
      .map((el) => {
        el.message;
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
  let { error } = reviewSchema.validate(req.body.review);
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
