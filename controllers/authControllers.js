const ets = require("express");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");
const Student = require("../models/users/studentModel");

// 01 signup;
const signup = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log("###############signup############", req.body);
  // Student
  next();
});

// 02 login;
const login = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log("###############login############", req.body);
  next();
});

// 03 logout;
const protect = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {});

const assignableTo = function (...rules) {
  return catchAsyncMiddle(async function (
    req = ets.request,
    res = ets.response,
    next
  ) {});
};

const logout = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {});

module.exports = {
  signup,
  login,
  protect,
  assignableTo,
  logout,
};
