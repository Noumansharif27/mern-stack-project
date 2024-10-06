const Joi = require("joi");

module.exports.courseSchema = Joi.object({
  course: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  reviews: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().min(1),
  }).required(),
});

// module.exports.reviewSchema = Joi.object({
//   comment: Joi.string().required(),
//   rating: Joi.number().min(1),
// });
