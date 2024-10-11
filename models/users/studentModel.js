const mongoose = require("mongoose");
const User = require("./_baselUserSchema");
const catchAsyncMiddle = require("../../utils/catchAsyncMiddle");
const AppError = require("../../utils/appError");

const progressSchema = new mongoose.Schema({
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

const studentSchema = new mongoose.Schema({
  enrolledCourses: [
    {
      courseId: {
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
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      addedAt: { type: Date, default: Date.now() },
    },
  ],
  cartCourses: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      addedAt: { type: Date, default: Date.now() },
    },
  ],
  wishCourses: [
    {
      courseId: {
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
  const { enrolledCourses, archivedCourses, password, __t, ...filteredInfo } =
    this.toObject();
  return filteredInfo;
};

const getEnrolledCourseWithProgress = catchAsyncMiddle(async (req, res) => {
  const { courseId } = req.body;
  const student = req.user;

  // Find the enrolled course with progress
  let enrolledCourse = student.enrolledCourses.find(
    (course) => course.courseId.toString() === courseId
  );

  if (!enrolledCourse) {
    return next(new AppError("Course not found in enrolled section!", 404));
  }

  enrolledCourse = enrolledCourse.populate("enrolledCourses.courseId");

  // Return the course data along with the student's progress
  sendD;
});

progressSchema.virtual("status").get(function () {
  // ["started", "in progress", "completed"]
});

const Student = User.discriminator("Student", studentSchema);
module.exports = Student;
