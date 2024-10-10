const ets = require("express");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");
const Student = require("../models/users/studentModel");

/**
 * Profile [basic info, courses, teachers, messages, chats, reviews];
 */

const getBasicInfo = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const courses = Student.find;
  next();
});

/**
 * Courses [enrolled, enrolledContent ,archived cart, wishlist]:
 * 01) StudentEnrolledCoursesControllers [getAll, enrollOne, archiveOne]:
 * 02) StudentEnrolledContentCourse [enrolledContent of course with progress];
 * 03  StudentArchivedCoursesControllers
 * 04) StudentCartCoursesControllers: []
 * 05) StudentWishlistCoursesControllers:
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
  const courses = Student.find;
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

// 02) StudentEnrolledContentCourse
const getEnrolledCourseContent = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log("archiveEnrolledCourse Courses middle");
  next();
});

// 03) StudentArchivedCoursesControllers:
const getArchivedCourses = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log("getCartCourses Courses middle");
  next();
});

const unArchiveCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log("getCartCourses Courses middle");
  next();
});

// 04) StudentCartCoursesControllers:
const getCartCourses = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log("getCartCourses Courses middle");
  next();
});

const addCartCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log("addCartCourse Courses middle");
  next();
});

const removeCartCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log("removeCartCourse Courses middle");
  next();
});

// 05) StudentWishlistCoursesControllers:
const getWishlistCourses = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log("getWishlistCourses Courses middle");
  next();
});

const addWishlistCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log("addWishlistCourse Courses middle");
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

/**
 * Student Teachers;
 */

const getAssignedTeachers = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {});

module.exports = {
  getEnrolledCourses,
  enrollNewCourse,
  archiveEnrolledCourse,

  getEnrolledCourseContent,

  getArchivedCourses,
  unArchiveCourse,

  getCartCourses,
  addCartCourse,
  removeCartCourse,

  getWishlistCourses,
  addWishlistCourse,
  removeCourseFromWishlist,

  getAssignedTeachers,
};
