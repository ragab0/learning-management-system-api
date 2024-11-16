const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
    index: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    index: true,
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentor",
    required: true,
    index: true,
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  Review: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// to ensure that one review for each course;
reviewSchema.index({ student: 1, course: 1 }, { unique: true });
// to faster retrieving by field;
reviewSchema.index({ student: 1 });
reviewSchema.index({ mentor: 1 });
reviewSchema.index({ course: 1 });

/* Pre-hook for automatic population */
reviewSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: "course",
      select: "title",
    },
    {
      path: "student",
      select: "fname lname photo",
    },
  ]);
  next();
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
