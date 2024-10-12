const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  content: String,
  createdAt: Date,
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
