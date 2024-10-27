const ets = require("express");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");
const { sendResult, sendResults } = require("./handlers/send");
const AppError = require("../utils/appError");
const Course = require("../models/courseModel");

/**
 * Student [basic info (Profile), courses, teachers, messages, chats, reviews];
 *
 * ~~ Student Courses:
 * 01) enrolled: [getAll, enrollOne, archiveOne]:
 * 02) enrolledContent: [getOne];
 * 03  archived: [getAll, unArOne];
 * 04) cart: [getAll, addOne, removeOne, wishOne (move)];
 * 05) wishlist: [getAll, addOne, removeOne, cartOne (move)];
 * 06) checkout cart courses;
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
      populate: {
        path: "mentor",
        model: "Mentor",
        select: "fname lname headline photo",
      },
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
// enroll not subscribe that is the secure version......
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

  req.user.enrolledCourses.push({ _id: id });
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
  if (index === -1)
    return next(new AppError("Course not found in enrolled courses!", 404));

  const result = req.user.enrolledCourses.splice(index, 1)?.at(0);

  req.user.archivedCourses.push(result);
  await req.user.save();
  sendResult(res, undefined);
});

const getBaughtCourseContent = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  let { courseId: id } = req.params;

  let populatedResult = await req.user.populate([
    {
      path: "enrolledCourses._id",
      model: "Course",
      populate: {
        path: "mentor",
        model: "Mentor",
        select: "fname lname photo headline description",
      },
    },
    {
      path: "archivedCourses._id",
      model: "Course",
      populate: {
        path: "mentor",
        model: "Mentor",
        select: "fname lname photo headline description",
      },
    },
  ]);

  let result = [
    ...populatedResult.enrolledCourses,
    ...populatedResult.archivedCourses,
  ].find((e) => e && e._id.equals(id));
  if (!result) return next(new AppError("Buy first to get access!", 404));

  sendResult(res, result);
});

const updateBaughtCourseProgress = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  let { courseId: id } = req.params;
  let { progress } = req.body;

  let index1 = req.user.enrolledCourses.findIndex((e) => e && e._id.equals(id));
  let index2 = req.user.archivedCourses.findIndex((e) => e && e._id.equals(id));
  if (!index1 || !index2)
    return next(new AppError("Course has been deleted!", 404));

  if (index1) req.user.enrolledCourses[index1].progress = progress;
  else req.user.archivedCourses[index2].progress = progress;

  await req.user.save();
  sendResult(res, undefined, 200);
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
    return next(new AppError("Course not found in archived courses!", 404));

  const result = req.user.archivedCourses.splice(index, 1)?.at(0);
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

  const index1 = req.user.enrolledCourses.findIndex(
    (e) => e && e._id.equals(id)
  );
  if (index1 !== -1)
    return next(new AppError("Course is already enrolled in!", 404));

  const index2 = req.user.archivedCourses.findIndex(
    (e) => e && e._id.equals(id)
  );
  if (index2 !== -1)
    return next(new AppError("Course is already enrolled in & archived!", 404));

  const index3 = req.user.cartCourses.findIndex((e) => e && e._id.equals(id));
  if (index3 !== -1)
    return next(new AppError("Course is already in cart!", 404));

  // remove it without causing error;
  const index = req.user.wishCourses.findIndex((e) => e && e._id.equals(id));
  if (index !== -1) req.user.wishCourses.splice(index, 1);

  req.user.cartCourses.push({ _id: id });
  await req.user.save();
  sendResult(res, undefined);
});

const removeCartCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { id } = req.body;

  const index = req.user.cartCourses.findIndex((e) => e && e._id.equals(id));
  if (index === -1) return next(new AppError("Course not found in cart!", 404));

  req.user.cartCourses.splice(index, 1);
  await req.user.save();
  sendResult(res, undefined);
});

/****************** StudentCartCoursesCheckout ******************/

const checkout = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  if (req.user.cartCourses?.length <= 0) {
    return next(new AppError("Cart is empty!", 404));
  }

  // payment FEATURE IS COMING...;
  req.user.enrolledCourses.push(...req.user.cartCourses);

  await Course.updateMany(
    { _id: { $in: req.user.cartCourses.splice(0) } },
    { $inc: { totalStudents: 1 } }
  );

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

  const index1 = req.user.enrolledCourses.findIndex(
    (e) => e && e._id.equals(id)
  );
  if (index1 !== -1)
    return next(new AppError("Course is already enrolled in!", 404));

  const index2 = req.user.archivedCourses.findIndex(
    (e) => e && e._id.equals(id)
  );
  if (index2 !== -1)
    return next(new AppError("Course is already enrolled in & archived!", 404));

  const index3 = req.user.wishCourses.findIndex((e) => e && e._id.equals(id));
  if (index3 !== -1)
    return next(new AppError("Course is already in wishlist!", 404));

  // if in cart remove it without causing error;
  const index = req.user.cartCourses.findIndex((e) => e && e._id.equals(id));
  if (index !== -1) req.user.cartCourses.splice(index, 1);

  req.user.wishCourses.push({ _id: id });
  await req.user.save();
  sendResult(res, undefined);
});

const removeWishlistCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { id } = req.body;
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
) {
  // const mentors = (await req.user.enrolledCourses.populate("_id"))
  //   .enrolledCourses;

  const populatedResults = await req.user.populate({
    path: `enrolledCourses._id archivedCourses._id`,
    model: "Course",
    populate: {
      path: "mentor",
      model: "Mentor",
      select: "fname lname headline photo",
    },
  });

  const mentors = [
    ...populatedResults.enrolledCourses,
    ...populatedResults.archivedCourses,
  ]
    .map(({ _id: course }) => course.mentor)
    .filter(
      (mentor, index, self) =>
        index === self.findIndex((m) => m._id === mentor._id)
    );

  const uniqueMentors = Array.from(
    new Map(mentors.map((item) => [item._id.toString(), item])).values()
  );
  sendResults(res, uniqueMentors);
});

module.exports = {
  getEnrolledCourses,
  enrollNewCourse,
  archiveEnrolledCourse,
  getBaughtCourseContent,
  updateBaughtCourseProgress,
  checkout,

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
