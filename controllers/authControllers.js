const ets = require("express");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");
const Student = require("../models/users/studentModel");

/**
 *  AUTHintication controllers:
 *  == the signup controller - before auth;
 *  == the login controller - AUTH STEP 01 / 02;
 *  == the protectedRoutes controller - AUTH STEP 02 / 02;
 *
 */

const signup = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log("###############signup############", req.body);
  // Student
  next();
});

const login = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log("###############login############", req.body);
  next();
});

/**
 *  Authorization controllers
 *  == the assignableTo - which is responsible for assigning specific types of users to specific actions;
 *     && it came after the protectedRoutes controller && before berforming the action itself (middle/method of action);
 */

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

/**
 * Logout - in case u didn't see me, good bey, good evening, good morning xDDDDD;
 *
 */

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
