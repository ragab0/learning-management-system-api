const ets = require("express");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");
const Mentor = require("../models/users/mentorModel");
const Course = require("../models/courseModel");
const { sendResults, sendResult } = require("./handlers/send");

/**
 * [getProfile, updateProfile] handled by userControllers;
 * - topMentors
 * - taughtCourses
 * - messages,
 * - chats,
 * - reviews;
 *
 */

const getTopMentors = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  const topMentors = Mentor.aggregate([
    {
      $project: {
        name: 1, // Include any other fields you want in the result
        numberOfCourses: { $size: "$taughtCourses" }, // Calculate the number of created courses
      },
    },
    { $sort: { numberOfCourses: -1 } }, // Sort mentors by the number of courses in descending order
    { $limit: 10 }, // Limit to top 10 mentors
  ]);
});

/** Taught courses [getAll, create, update, and delete one] */

const getTaughtCourses = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const courses = (await req.user.populate("taughtCourses")).taughtCourses;
  sendResults(res, courses);
});

const createCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const newCourse = new Course(req.body);
  const course = await newCourse.save({
    validateBeforeSave: false,
  });

  req.user.taughtCourses.unshift({ _id: course._id });
  await req.user.save();
  sendResult(res, undefined);
});

const updateTaughtCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  // updating populated data doesn't affect the real reference;
  const { id } = req.body;
  const index = req.user.taughtCourses.findIndex(
    (c) => c._id.toString() === id
  );
  if (index === -1) return next(new AppError("Course not found!"));
  await Course.findByIdAndDelete(id, req.body);
  return sendResult(res, undefined);
});

const deleteTaughtCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { id } = req.body;
  const index = req.user.taughtCourses.findIndex(
    (c) => c._id.toString() === id
  );
  if (index === -1)
    return next(new AppError("Course not found in taughtCourses!"));
  req.user.taughtCourses.splice(index, 1);
  await req.user.save();
  const result = await Course.findByIdAndDelete(id);
  // if (!result) return next(new AppError("Course not found courses!"));
  return sendResult(res, undefined);
});

const getTaughtCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { id } = req.body;
  const index = req.user.taughtCourses.findIndex(
    (c) => c._id.toString() === id
  );
  if (index === -1)
    return next(new AppError("Course not found in taughtCourses!"));

  const course = await req.user.populate("taughtCourses")[index];
  sendResult(res, course);
});

module.exports = {
  getTaughtCourses,
  createCourse,
  updateTaughtCourse,
  deleteTaughtCourse,
  getTaughtCourse,
};
