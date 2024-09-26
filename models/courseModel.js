const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
    title: {
      type: String,
      default: "a tutorial course!",
    },
    description: {
      type: String,
      default: "a tutorial course description!",
    },
    modules: [
      {
        title: String,
        description: String,
        lessons: [
          {
            title: String,
            content: String,
          },
        ],
      },
    ],
    tags: Array(String),
    photo: String,
    price: Number,
    duration: Number,
    createdAt: Date,
    updatedAt: Date,
  },
  {
    toJSON: { virtuals: true },
  }
);

/**
 * instances mehtods;
 */

courseSchema.virtual("studentCount").get(function () {
  return this.enrolledStudents ? this.enrolledStudents.length : 0;
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
