const ets = require("express");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");

const getCourses = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  const users = "";
  // sendThem;
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

const getCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  const users = "";
  // sendThem;
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

const createCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  const users = "";
  // sendThem;
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

const updateCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  const users = "";
  // sendThem;
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

const deleteCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  const users = "";
  // sendThem;
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

module.exports = {
  getCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
};
