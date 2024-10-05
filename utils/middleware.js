const { courseSchema } = require("../schemaValidation.js");

module.exports.courseValidation = (req, res, next) => {
  let { error } = courseSchema.validate(req.body);
  if (error) {
    let errorMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorMsg);
  } else {
    next();
  }
};
