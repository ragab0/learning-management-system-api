const ets = require("express");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");

// used with nested routes of [courseId,studentId,mentorId, admin];
const getAllReviewsOf = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log(req.params);
  if (req.params.studentId) {
  } else if (req.params.mentorId) {
  } else if (req.params.courseId) {
  } else if (req.user.role === "admin") {
  }
});

const addReview = function () {};
const updateReview = function () {};
const deleteReview = function () {};

module.exports = {
  getAllReviewsOf,
  addReview,
  updateReview,
  deleteReview,
};
