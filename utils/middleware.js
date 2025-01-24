const { courseSchema, reviewSchema } = require("../schemaValidation.js");
const Course = require("../models/course.js");
const Review = require("../models/review.js");
const ExpressError = require("./ExpressError.js");
const wrapAsync = require("./wrapAsync.js");

// Verification for User
module.exports.isLogedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You have to be Logge-In first!");
    return res.redirect("/login");
  }
  next();
};

// Chect if all the fields are filled
module.exports.isUserAvaliable = wrapAsync(async (req, res, next) => {
  const user = req.body.user;
  if (!user) {
    req.flash("error", "Something is missing!");
    res.redirect("/signin");
  }
  next();
});

// Save the current URL before logIn
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// Verification for Course ownership
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

// Verify if the user is review owner
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
    return res.redirect(`/login`);
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

// User middleware to check if the user had aleady purchased the course
// module.exports.isBuyedAlready = async (req, res, next) => {
//   try {
//     if (req.isAuthenticated()) {
//       const { courseId } = req.params;
//       const course = await Course.findById(courseId);

//       const purchasedCourses = res.locals.currentUser.courses;
//       if (purchasedCourses.includes(course._id)) {
//         res.locals.isAlreadyPurchased = true;
//       } else {
//         res.locals.isAlreadyPurchased = true;
//         next();
//       }
//       next();
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

// Check wether the user had enrolled in course
module.exports.isStudent = wrapAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const user = res.locals.currentUser;
  const purchaseStatus = res.locals.isAlreadyPurchased;
  const course = await Course.findById(courseId);

  if (!user.courses.includes(course._id)) {
    req.flash(
      "error",
      "Unauthorized move, you are not the student of this course!"
    );
    purchaseStatus = false;
    return res.redirect(`/courses/${courseId}`);
  }
  purchaseStatus = true;
  next();
});

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

// Confirm whether the user is eligable for review.
module.exports.isEligableForReview = async (req, res, next) => {
  const { courseId } = req.params;
  const course = await Course.findById(courseId);
  const user = res.locals.currentUser;
  const courseReviews = course.reviews;

  // If relative course does not exists.
  if (!course) {
    req.flash("error", "The course you are looking for does not exists!");
    return res.redirect(`/courses`);
  }

  // Confirm the loged-In status.
  if (!user) {
    req.flash("error", "You have to be logged-In first!");
    return res.redirect(`/login`);
  }

  // Restricting non buyer.
  const isStudent = user.courses.some((courseId) =>
    courseId.equals(course.students._id)
  );
  if (isStudent) {
    req.flash("error", "You have to buy the course first!");
    return res.redirect(`/courses/${courseId}`);
  }

  // restricting student to one-time review.
  const hasReviewed = courseReviews.some((review) =>
    review.author.equals(user._id)
  );
  if (hasReviewed) {
    req.flash("error", "You have already reviewed this course!");
    return res.redirect(`/courses/${courseId}`);
  }

  // Restricting the owner for reviewing.
  if (user && course.author._id.equals(user._id)) {
    req.flash("error", "You cannot review your own course!");
    return res.redirect(`/courses/${courseId}`);
  }
  next();
};
