const ets = require("express");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");
const Course = require("../models/courseModel");

function sendResults(res, results, page, totalPages) {
  res.status(200).json({
    status: "success",
    results,
    page,
    totalPages,
  });
}

function sendResult(res, result) {
  res.status(result ? 200 : 204).json({
    status: "success",
    result,
  });
}

const getCourses = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  let myQuery = { ...req.query };
  const courses = await Course.find(myQuery.length > 0 ? myQuery : {});

  sendResults(res, courses, page, totalPages);
});

const getCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  const { id } = req.body;
  const course = await Course.findById(id);
  sendResult(res, course);
});

const createCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  const course = await Course.create({ mentorId: req.user._id, ...req.body });

  sendResult(res, course);
});

const updateCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  const { id } = req.body;
  const course = await Course.findByIdAndUpdate(id, req.body);
  sendResult(res, course);
});

const deleteCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  const { id } = req.body;
  await Course.findByIdAndDelete(id);
  sendResult(res);
});

module.exports = {
  getCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
};
