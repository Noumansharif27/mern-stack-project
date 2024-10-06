const { courseSchema } = require("../schemaValidation.js");
const Course = require("../models/course.js");

module.exports.courseValidation = (req, res, next) => {
  let { error } = courseSchema.validate(req.body);
  if (error) {
    let errorMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorMsg);
  } else {
    next();
  }
};

module.exports.isLogedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You mmust be loged in first!");
    res.redirect("/login");
  }
  next();
};

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
