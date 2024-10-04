const express = require("express");
const router = express.Router({ mergeParams: true });
const Course = require("../models/course.js");
const { courseValidation } = require("../utils/middleware.js");
const { ExpressError } = require("../utils/middleware.js");

// Index Rought
router.get("/", async (req, res) => {
  let courses = await Course.find();
  // console.log(courses);
  res.render("index.ejs", { courses });
});

router.get("/new", (req, res) => {
  res.render("new.ejs");
});

router.post("/", courseValidation, async (req, res) => {
  const course = req.body.course;
  // console.log(course);

  let newCourse = new Course({
    ...course,
  });

  newCourse.author = req.user._id;
  await newCourse.save();

  // console.log(newCourse);
  res.redirect("/courses");
});

router.get("/:id/show", async (req, res) => {
  const { id } = req.params;
  // console.log(id);

  let course = await Course.findById(id).populate("author");
  // course.author = req.user;

  res.render("show.ejs", { course });
});

router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  let course = await Course.findById(id);
  res.render("edit.ejs", { course });
});

router.post("/:id/edit", courseValidation, async (req, res) => {
  if (!req.body.course) {
    throw new ExpressError(400, "Bad request");
  }

  const { id } = req.params;
  let course = await Course.findByIdAndUpdate(id, { ...req.body.course });
  req.flash("success", "Course content edit successfully!");
  res.redirect(`/courses/${id}/show`);
});

module.exports = router;
