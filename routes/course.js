const express = require("express");
const router = express.Router({ mergeParams: true });
const Course = require("../models/course.js");
const {
  validateCourse,
  isLogedIn,
  isOwner,
} = require("../utils/middleware.js");
const { ExpressError } = require("../utils/middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");

// Index Rought
router.get("/", async (req, res) => {
  let courses = await Course.find();
  // console.log(courses);
  res.render("course/index.ejs", { courses });
});

// New Rought
router.get("/new", isLogedIn, (req, res) => {
  res.render("course/new.ejs");
});

// New Post Rrout
router.post("/", isLogedIn, validateCourse, async (req, res) => {
  const course = req.body.course;
  // console.log(course);

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
});

// Show Rought
router.get("/:id/show", async (req, res) => {
  const { id } = req.params;

  let course = await Course.findById(id)
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
});

// Edit Rought
router.get("/:id/edit", isLogedIn, isOwner, async (req, res) => {
  const { id } = req.params;
  let course = await Course.findById(id);
  res.render("course/edit.ejs", { course });
});

// Edit Post Rought
router.post(
  "/:id/edit",
  isLogedIn,
  isOwner,
  validateCourse,
  wrapAsync(async (req, res, next) => {
    if (!req.body.course) {
      throw new ExpressError(400, "Bad request");
    }

    const { id } = req.params;
    let course = await Course.findByIdAndUpdate(id, { ...req.body.course });
    req.flash("success", "Course content edit successfully!");
    res.redirect(`/courses/${id}/show`);
  })
);

// Destroy Rought
router.delete("/:id", isLogedIn, isOwner, async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const result = await Course.findByIdAndDelete(id);
  console.log(result);

  req.flash("success", "Course deleted successfully!");
  res.redirect("/courses");
});

module.exports = router;
