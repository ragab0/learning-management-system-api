const ets = require("express");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");
const Review = require("../models/reviewModel");
const { sendResult, sendResults } = require("./handlers/send");

const getAllReviewsOfCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  const filter = { course: req.params.courseId };
  const reviews = await Review.find(filter);
  sendResults(res, reviews);
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
  let index1 = req.user.enrolledCourses.findIndex(
    (e) => e && e._id.equals(req.body.course)
  );
  let index2 = req.user.archivedCourses.findIndex(
    (e) => e && e._id.equals(req.body.course)
  );
  if (!index1 || !index2)
    return next(
      new AppError("don't play with data bro, course isn't yours!", 404)
    );

  const result = await Review.findOneAndUpdate(
    { student: req.user._id, course: req.body.course },
    { ...req.body, student: req.user._id },
    {
      upsert: true,
      new: true,
      runValidators: true,
    }
  );
  sendResult(res, result);
});

const deleteReview = function () {};

module.exports = {
  getAllReviewsOfCourse,
  getAllReviewsOfMentor,
  getAllReviewsOfStudent,
  addReview,
  deleteReview,
};
