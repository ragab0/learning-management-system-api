const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  modules: [
    {
      title: String,
      description: String,
      order: Number,
      lessons: [
        {
          title: String,
          content: String,
          order: Number,
        },
      ],
    },
  ],
  reviews: [
    {
      student: { type: ObjectId, ref: "Student" },
      rating: Number,
      comment: String,
      createdAt: Date,
    },
  ],

  title: {
    type: String,
    default: "a tutorial course!",
  },
  description: {
    type: String,
    default: "a tutorial course description!",
  },
  tags: Array(String),
  photo: String,
  price: Number,
  duration: Number,
  createdAt: Date,
  updatedAt: Date,
});

/**
 * instances mehtods;
 */

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
