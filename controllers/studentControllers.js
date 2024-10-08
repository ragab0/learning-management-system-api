const ets = require("express");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");

/**
 * Profile [basic info, courses, teachers, messages, chats, reviews];
 */
const getAssignedTeachers = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {});

/**
 * Courses [enrolled, inCart inWishlist]:
 * 01) StudentEnrolledCoursesControllers:
 * 02) StudentCartCoursesControllers:
 * 03) StudentWishlistCoursesControllers:
 *
 * Teachers [];
 * Reviews [];
 * Chats [];
 *
 */

// 01) StudentEnrolledCoursesControllers:
const getEnrolledCourses = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log("getEnrolledCourses Courses middle");
  next();
});

const enrollNewCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log("enrollNewCourse Courses middle");
  next();
});

const archiveEnrolledCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log("archiveEnrolledCourse Courses middle");
  next();
});

// 02) StudentCartCoursesControllers:
const getCartCourses = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log("getCartCourses Courses middle");
  next();
});

const addCourseToCart = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log("addCourseToCart Courses middle");
  next();
});

const removeCourseFromCart = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log("removeCourseFromCart Courses middle");
  next();
});

// 03) StudentWishlistCoursesControllers:
const getWishlistCourses = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log("getWishlistCourses Courses middle");
  next();
});

const addCourseToWishlist = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log("addCourseToWishlist Courses middle");
  next();
});

const removeCourseFromWishlist = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log("removeCourseFromWishlist Courses middle");
  next();
});

module.exports = {
  getAssignedTeachers,

  getEnrolledCourses,
  enrollNewCourse,
  archiveEnrolledCourse,

  getCartCourses,
  addCourseToCart,
  removeCourseFromCart,

  getWishlistCourses,
  addCourseToWishlist,
  removeCourseFromWishlist,
};
