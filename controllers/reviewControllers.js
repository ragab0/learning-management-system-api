const ets = require("express");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");
const Review = require("../models/reviewModel");
const { sendResult, sendResults } = require("./handlers/send");
const AppError = require("../utils/appError");

const getAllReviewsOfCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  const filter = { course: req.params.courseId };
  const reviews = await Review.find(filter);
  const statics = await Review.getCourseRatingStatsAndDistribution(
    req.params.courseId
  );

  sendResults(res, { reviews, statics });
});

const getAllReviewsOfMentor = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  const filter = { mentor: req.user._id };
  const reviews = await Review.find(filter);
  sendResults(res, reviews);
});

const getAllReviewsOfStudent = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  const filter = { student: req.user._id };
  const reviews = await Review.find(filter);
  sendResults(res, reviews);
});

const addReview = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  let user = await req.user.populate([
    {
      path: "enrolledCourses._id",
      model: "Course",
      select: "title mentor",
    },
    {
      path: "archivedCourses._id",
      model: "Course",
      select: "title mentor",
    },
  ]);

  let course =
    user.enrolledCourses.find((e) => e && e._id.equals(req.body.course)) ||
    user.archivedCourses.find((e) => e && e._id.equals(req.body.course));

  if (!course)
    return next(
      new AppError("don't play with data bro, course isn't yours!", 403)
    );

  // get student and course mentor form the database instead of the coming req to ensure data is for him LIKE course ^^;
  const student = req.user._id;
  const { mentor } = course._id;

  const result = await Review.findOneAndUpdate(
    { student: req.user._id, course: req.body.course },
    { ...req.body, student, mentor },
    {
      upsert: true,
      new: true,
      runValidators: true,
    }
  );

  sendResult(res, result);
});

const getReview = catchAsyncMiddle(async function (req, res, next) {
  const review = await Review.findOne({
    student: req.user._id,
    course: req.params.courseId,
  });

  if (!review) {
    return next(new AppError("No review found for this course!", 404));
  }

  sendResult(res, review);
});

const deleteReview = catchAsyncMiddle(async function (req, res, next) {
  // let user = await req.user.populate([
  //   {
  //     path: "enrolledCourses._id",
  //     model: "Course",
  //     select: "title mentor",
  //   },
  //   {
  //     path: "archivedCourses._id",
  //     model: "Course",
  //     select: "title mentor",
  //   },
  // ]);

  // let course =
  //   user.enrolledCourses.find((e) => e && e._id.equals(req.params.courseId)) ||
  //   user.archivedCourses.find((e) => e && e._id.equals(req.params.courseId));

  // if (!course)
  //   return next(
  //     new AppError("don't play with data bro, course isn't yours!", 403)
  //   );

  const review = await Review.findOneAndDelete({
    student: req.user._id,
    course: req.params.courseId,
  });

  if (!review) {
    return next(new AppError("No review found to delete!", 404));
  }

  sendResult(res, undefined);
});

module.exports = {
  getAllReviewsOfCourse,
  getAllReviewsOfMentor,
  getAllReviewsOfStudent,
  addReview,
  getReview,
  deleteReview,
};
