const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

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
  price: {
    type: Number,
    required: true,
  },
  publishDate: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

courseSchema.post("findOneAndDelete", async (course) => {
  if (course) {
    await Review.deleteMany({ _id: { $in: course.reviews } });
  }
});

module.exports = mongoose.model("Course", courseSchema);
