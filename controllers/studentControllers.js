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
 * Courses && cart && wishlist:
 * 01) StudentEnrolledCoursesControllers:
 * 02) StudentCartCoursesControllers:
 * 03) StudentWishlistCoursesControllers:
 *
 */

// 01) StudentEnrolledCoursesControllers:
const getEnrolledCourses = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {});

const enrollNewCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {});

const archiveEnrolledCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {});

// 02) StudentCartCoursesControllers:
const getCartCourses = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {});

const addCourseToCart = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {});

const removeCourseFromCart = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {});

// 03) StudentWishlistCoursesControllers:
const getWishlistCourses = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {});

const addCourseToWishlist = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {});

const removeCourseFromWishlist = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {});

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
