const mongoose = require("mongoose");
const userSchema = require("./_globalUserSchema");
/**
 *  01 inherit the original object that passed to the schema;
 *  02 inherit the methods iheriting the prototype of this derived schema by the user schema;
 *
 */

const studentSchema = new mongoose.Schema({
  // 01
  ...userSchema.obj,
  inFavouriteCourses: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    },
  ],
  inCartCourses: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    },
  ],
  enrolledCourses: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      enrollmentDate: { type: Date, default: Date.now() },
      overallProgress: { type: Number, default: 0 }, // computed in fact - but persited is better;
      status: {
        type: String,
        enum: ["Not Started", "In Progress", "Completed"],
        default: "Not Started",
      },
      progress: {
        completedModules: [
          { type: mongoose.Schema.Types.ObjectId, ref: "Course.module" },
        ],
        completedLessons: [
          { type: mongoose.Schema.Types.ObjectId, ref: "Course.module.lesson" },
        ],
        lastUpdated: { type: Date, default: Date.now() },
      },
    },
  ],
});
// 02;
studentSchema.methods = userSchema.methods;

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
