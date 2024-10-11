const ets = require("express");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");
const Student = require("../models/users/studentModel");
const Mentor = require("../models/users/mentorModel");
const { sendResult, sendResults } = require("./handlers/send");
const AppError = require("../utils/appError");

/**
 * Mentor [basic info (Profile), courses, teachers, messages, chats, reviews];
 */

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
  res = ets.response
) {
  const { page, pageSize } = req.query;
  const results = req.user.enrolledCourses;
  console.log(results, "####", page, pageSize);

  const totalPages = Math.ceil(results.length / parseInt(pageSize));
  sendResults(res, results, +page, totalPages);
});

// enroll not subscribe which is the secure version......
const enrollNewCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { id } = req.body;
  const index = req.user.enrolledCourses.findIndex((e) => e._id === id);
  if (index !== -1) return next(new AppError("Course is already enrolled!"));

  req.user.enrolledCourses.push(id);
  await req.user.save();
  sendResult(res, undefined);
});
// done
const archiveEnrolledCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { id } = req.body;
  const index = req.user.enrolledCourses.findIndex((e) => e._id === id);
  if (index === -1) return next(new AppError("Course not found!"));

  const result = req.user.enrolledCourses.splice[(index, 1)];
  req.user.archivedCourses.push(result);
  await req.user.save();
  sendResult(res, undefined);
});

// 02) StudentEnrolledContentCourse
const getEnrolledCourseContent = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  let { id } = req.body;
  const result = req.user.enrolledCourses.find((e) => e._id === id);
  if (!result) return next(new AppError("Buy first to get access!"));
  sendResult(res, result);
});

// 03) StudentArchivedCoursesControllers:
const getArchivedCourses = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  let { page, pageSize } = req.query;
  const results = req.user.archivedCourses;
  const totalPages = Math.ceil(results.length / pageSize);
  sendResults(res, results, page, totalPages);
});

const unArchiveCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { id } = req.body;
  const index = req.user.archivedCourses.findIndex((e) => e._id === id);
  if (index === -1) return next(new AppError("Course not found in archived!"));

  const result = req.user.archivedCourses.splice[(index, 1)];
  req.user.enrolledCourses.push(result);
  await req.user.save();
  sendResult(res, undefined);
});

// 04) StudentCartCoursesControllers:
const getCartCourses = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  let { page, pageSize } = req.query;
  const results = req.user.cartCourses;
  const totalPages = Math.ceil(results.length / parseInt(pageSize));
  sendResults(res, results, page, totalPages);
});

const addCartCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { id } = req.body;
  const index = req.user.cartCourses.findIndex((e) => e._id === id);
  if (index !== -1) return next(new AppError("Course is already in cart!"));

  req.user.enrolledCourses.push(id);
  await req.user.save();
  sendResult(res, undefined);
});

const removeCartCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { id } = req.body;
  const index = req.user.cartCourses.findIndex((e) => e._id === id);
  if (index === -1) return next(new AppError("Course not found in cart!"));

  req.user.cartCourses.splice(index, 1);
  await req.user.save();
  sendResult(res, undefined);
});

const moveCartWishlistCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { id } = req.body;
  const index = req.user.cartCourses.findIndex((e) => e._id === id);
  if (index === -1) return next(new AppError("Course not found in cart!"));

  const result = req.user.cartCourses.splice(index, 1);
  req.user.wishCourses.push(result);
  await req.user.save();
  sendResult(res, undefined);
});

// 05) StudentWishlistCoursesControllers:
const getWishlistCourses = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  let { page, pageSize } = req.query;
  const results = req.user.wishCourses;
  const totalPages = Math.ceil(results.length / parseInt(pageSize));
  sendResults(res, results, page, totalPages);
});

const addWishlistCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { id } = req.body;
  const index = req.user.wishCourses.findIndex((e) => e._id === id);
  if (index !== -1) return next(new AppError("Course is already in cart!"));

  req.user.wishCourses.push(id);
  await req.user.save();
  sendResult(res, undefined);
});

const removeWishlistCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { id } = req.body;
  const index = req.user.wishCourses.findIndex((e) => e._id === id);
  if (index === -1) return next(new AppError("Course not found in wishlist!"));

  req.user.wishCourses.splice[(index, 1)];
  await req.user.save();
  sendResult(res, undefined);
});

const moveWishlistCartCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { id } = req.body;
  const index = req.user.wishCourses.findIndex((e) => e._id === id);
  if (index === -1) return next(new AppError("Course not found in wishlist!"));

  const result = req.user.wishCourses.splice(index, 1);
  req.user.cartCourses.push(result);
  await req.user.save();
  sendResult(res, undefined);
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
  moveCartWishlistCourse,

  getWishlistCourses,
  addWishlistCourse,
  removeWishlistCourse,
  moveWishlistCartCourse,

  getAssignedTeachers,
};
