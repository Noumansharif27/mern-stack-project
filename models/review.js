const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 1,
  },
});

module.exports.Review = mongoose.model("Review", reviewSchema);
