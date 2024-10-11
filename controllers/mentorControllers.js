const ets = require("express");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");

/**
 * Student info [basic info (Profile), courses, teachers, messages, chats, reviews];
 */

const getBasicInfo = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log(req.user);
  next();
});

const updateBasicInfo = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  Student.findByIdAndUpdate(req.user._id, req.body, { runValidators: true });
  next();
});

const getCreatedCourses = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  const courses = "";
});
