const ets = require("express");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");

const getCreatedCourses = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  const courses = "";
});
