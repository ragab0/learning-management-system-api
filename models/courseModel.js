const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
    modules: [
      {
        title: String,
        description: String,
        // order: Number,
        lessons: [
          {
            title: String,
            content: String,
            // order: Number,
            comments: [
              {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
                content: {
                  type: String,
                  required: [true, "A comment can't be empty!"],
                },
                createdAt: Date,
                updatedAt: Date,
              },
            ],
          },
        ],
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
