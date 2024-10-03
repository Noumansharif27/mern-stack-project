const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "/assets/default-course-image.jpg",
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  price: {
    type: Number,
    required: true,
  },
  publishDate: {
    type: Date,
    default: Date.now(),
  },
  rating: [],
});

module.exports = mongoose.model("Course", courseSchema);
