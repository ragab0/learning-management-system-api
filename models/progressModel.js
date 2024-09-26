const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  contentProgress: [
    {
      moduleId: { type: mongoose.Schema.Types.ObjectId },
      isCompleted: { type: Boolean, default: false },
      completedLessons: [
        {
          lessonId: { type: mongoose.Schema.Types.ObjectId },
          isCompleted: { type: Boolean, default: false },
          completedAt: Date,
        },
      ],
    },
  ],
  completedAt: Date,
});

progressSchema.virtual("status").get(function () {
  // ["started", "in progress", "completed"]
});

const CourseProgress = mongoose.model("CourseProgress", progressSchema);

module.exports = CourseProgress;
