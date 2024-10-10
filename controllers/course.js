const Course = require("../models/course.js");
const User = require("../models/user.js");
const { ExpressError } = require("../utils/middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");

// Index Rought
module.exports.IndexRought = async (req, res) => {
  let courses = await Course.find();
  res.render("course/index.ejs", { courses });
};

// New Rought
module.exports.getNewRought = (req, res) => {
  res.render("course/new.ejs");
};

// New Post Rought
module.exports.postNewRought = async (req, res) => {
  const course = req.body.course;

  // If the course image field is emptyo set default image
  if (!course.image) {
    course.image = "/assets/default-course-image.jpg";
  }
  let newCourse = new Course({
    ...course,
  });
  newCourse.author = req.user._id;
  await newCourse.save();

  req.flash("success", "Course created successfully!");
  res.redirect("/courses");
};

// Show Rought
module.exports.showRought = async (req, res) => {
  const { courseId } = req.params;

  let course = await Course.findById(courseId)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");

  if (!course) {
    req.flash("error", "Course you are looking for does not exists.");
    res.redirect("/courses");
  }
  res.render("course/show.ejs", { course });
};

// Edit Rought
module.exports.getEditRought = async (req, res) => {
  const { courseId } = req.params;
  let course = await Course.findById(courseId);
  res.render("course/edit.ejs", { course });
};

// Edit Post Rought
module.exports.postEditRought = wrapAsync(async (req, res, next) => {
  if (!req.body.course) {
    throw new ExpressError(400, "Bad request");
  }

  const { courseId } = req.params;
  await Course.findByIdAndUpdate(courseId, {
    ...req.body.course,
  });
  req.flash("success", "Course content edit successfully!");
  res.redirect(`/courses/${courseId}`);
});

// Get Purchase Rought
module.exports.getPurchaseRought = async (req, res) => {
  const { courseId } = req.params;
  // if (!res.locals.currentUser) {
  //   req.flash("error", "You have to be Logged-In first!");
  //   return res.redirect("/login");
  // }
  const course = await Course.findById(courseId);

  res.render("user/courseCheckout.ejs", { course });
};

// Post Purchase Rought
module.exports.postPurchaseRought = wrapAsync(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  const user = await User.findById(res.locals.currentUser._id);
  user.courses.push(course._id);
  await user.save();

  req.flash("success", "You have successfully completed your purchase.");
  res.redirect("/courses");
});

// Destroy Rought
module.exports.destroyRought = async (req, res) => {
  const { courseId } = req.params;
  await Course.findByIdAndDelete(courseId);

  req.flash("success", "Course deleted successfully!");
  res.redirect("/courses");
};
