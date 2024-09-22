const mongoose = require("mongoose");

const progressSchema = mongoose.Schema({
  completedModules: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Course.module" },
  ],
  completedLessons: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Course.module.lesson" },
  ],
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  lastUpdated: { type: Date, default: Date.now() },
});

const Progress = mongoose.model("Progress", progressSchema);
module.exports = Progress;
