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
    },
  ],
});
// 02;
studentSchema.methods = userSchema.methods;

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
