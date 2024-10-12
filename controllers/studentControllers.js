const ets = require("express");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");
const Student = require("../models/users/studentModel");
const Mentor = require("../models/users/mentorModel");
const { sendResult, sendResults } = require("./handlers/send");
const AppError = require("../utils/appError");

/**
 * Student [basic info (Profile), courses, teachers, messages, chats, reviews];
 *
 * ~~ Student Courses:
 * 01) enrolled: [getAll, enrollOne, archiveOne]:
 * 02) enrolledContent: [getOne];
 * 03  archived: [getAll, unArOne];
 * 04) cart: [getAll, addOne, removeOne, wishOne (move)];
 * 05) wishlist: [getAll, addOne, removeOne, cartOne (move)];
 *
 * ~~Teachers [];
 * ~~Reviews [];
 * ~~Chats [];
 *
 */

function getStudentCourses(arrField) {
  return async function (req = ets.request, res = ets.response) {
    const { page, pageSize } = req.query;
    const populatedResults = await req.user.populate({
      path: `${arrField}._id`,
      model: "Course",
    });

    const results = populatedResults[arrField];
    const totalPages = Math.ceil(results.length / parseInt(pageSize));
    sendResults(res, results, +page, totalPages);
  };
}

const getEnrolledCourses = catchAsyncMiddle(
  getStudentCourses("enrolledCourses")
);
const getArchivedCourses = catchAsyncMiddle(
  getStudentCourses("archivedCourses")
);
const getCartCourses = catchAsyncMiddle(getStudentCourses("cartCourses"));
const getWishlistCourses = catchAsyncMiddle(getStudentCourses("wishCourses"));

/******************** StudentEnrolledCoursesControllers: ********************/
// enroll not subscribe which is the secure version......
const enrollNewCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { id } = req.body;
  const index = req.user.enrolledCourses.findIndex(
    (e) => e && e._id.equals(id)
  );
  if (index !== -1)
    return next(new AppError("Course is already enrolled!", 404));

  req.user.enrolledCourses.push(id);
  await req.user.save();
  sendResult(res, undefined);
});

const archiveEnrolledCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { id } = req.body;
  const index = req.user.enrolledCourses.findIndex(
    (e) => e && e._id.equals(id)
  );
  if (index === -1) return next(new AppError("Course not found!", 404));

  const result = req.user.enrolledCourses.splice[(index, 1)];
  req.user.archivedCourses.push(result);
  await req.user.save();
  sendResult(res, undefined);
});

const getEnrolledCourseContent = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  let { id } = req.body;
  const result = req.user.enrolledCourses.find((e) => e && e._id.equals(id));
  if (!result) return next(new AppError("Buy first to get access!", 404));
  sendResult(res, result);
});

/******************** StudentArchivedCoursesControllers: ********************/
const unArchiveCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { id } = req.body;
  const index = req.user.archivedCourses.findIndex(
    (e) => e && e._id.equals(id)
  );
  if (index === -1)
    return next(new AppError("Course not found in archived!", 404));

  const result = req.user.archivedCourses.splice[(index, 1)];
  req.user.enrolledCourses.push(result);
  await req.user.save();
  sendResult(res, undefined);
});

/****************** StudentCartCoursesControllers:  ******************/

const addCartCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { id } = req.body;

  const index1 = req.user.cartCourses.findIndex((e) => e && e._id.equals(id));
  if (index1 !== -1)
    return next(new AppError("Course is already in cart!", 404));

  const index2 = req.user.wishCourses.findIndex((e) => e && e._id.equals(id));
  if (index2 !== -1) req.user.wishCourses.splice(index2, 1);

  req.user.cartCourses.push(id);
  await req.user.save();
  sendResult(res, undefined);
});

const removeCartCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { id } = req.body;
  console.log("######################################## REMOVE CART", req.body);

  const index = req.user.cartCourses.findIndex((e) => e && e._id.equals(id));
  if (index === -1) return next(new AppError("Course not found in cart!", 404));

  req.user.cartCourses.splice(index, 1);
  await req.user.save();
  sendResult(res, undefined);
});

/*************** StudentWishlistCoursesControllers: ***************/

const addWishlistCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { id } = req.body;

  const index1 = req.user.wishCourses.findIndex((e) => e && e._id.equals(id));
  if (index1 !== -1)
    return next(new AppError("Course is already in wishlist!", 404));

  const index2 = req.user.cartCourses.findIndex((e) => e && e._id.equals(id));
  if (index2 !== -1) req.user.cartCourses.splice(index2, 1);

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
  console.log("######################################## REMOVE WISH", req.body);

  const index = req.user.wishCourses.findIndex((e) => e && e._id.equals(id));
  if (index === -1)
    return next(new AppError("Course not found in wishlist!", 404));

  req.user.wishCourses.splice(index, 1);
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

  getWishlistCourses,
  addWishlistCourse,
  removeWishlistCourse,

  getAssignedTeachers,
};
