const mongoose = require("mongoose");
const User = require("./_baselUserSchema");

const studentSchema = new mongoose.Schema({
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

const Student = User.discriminator("Student", studentSchema);
module.exports = Student;
