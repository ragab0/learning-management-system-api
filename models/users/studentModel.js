const mongoose = require("mongoose");
const User = require("./_baselUserSchema");
const catchAsyncMiddle = require("../../utils/catchAsyncMiddle");
const AppError = require("../../utils/appError");

const progressSchema = new mongoose.Schema({
  contentProgress: [
    {
      module: { type: mongoose.Schema.Types.ObjectId },
      isCompleted: { type: Boolean, default: false },
      completedLessons: [
        {
          lesson: { type: mongoose.Schema.Types.ObjectId },
          isCompleted: { type: Boolean, default: false },
          completedAt: Date,
        },
      ],
    },
  ],
  completedAt: Date,
});

const studentSchema = new mongoose.Schema({
  enrolledCourses: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      progress: progressSchema,
      isFav: {
        type: Boolean,
        default: false,
      },
      addedAt: { type: Date, default: Date.now() },
    },
  ],
  archivedCourses: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      addedAt: { type: Date, default: Date.now() },
    },
  ],
  cartCourses: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      addedAt: { type: Date, default: Date.now() },
    },
  ],
  wishCourses: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      addedAt: { type: Date, default: Date.now() },
    },
  ],
});

/**
 * Insance methods;
 *
 */

studentSchema.methods.getBasicInfo = function () {
  const {
    enrolledCourses,
    archivedCourses,
    cartCourses,
    wishCourses,
    password,
    __t,
    ...filteredInfo
  } = this.toObject();
  return filteredInfo;
};

const getEnrolledCourseWithProgress = catchAsyncMiddle(async (req, res) => {
  const { courseId } = req.body;
  const student = req.user;

  // Find the enrolled course with progress
  let enrolledCourse = student.enrolledCourses.find(
    (course) => course.course.toString() === courseId
  );

  if (!enrolledCourse) {
    return next(new AppError("Course not found in enrolled section!", 404));
  }

  enrolledCourse = enrolledCourse.populate("enrolledCourses.course");

  // Return the course data along with the student's progress
  sendD;
});

progressSchema.virtual("status").get(function () {
  // ["started", "in progress", "completed"]
});

const Student = User.discriminator("Student", studentSchema);
module.exports = Student;
