const ets = require("express");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");
const Mentor = require("../models/users/mentorModel");
const Course = require("../models/courseModel");
const AppError = require("../utils/appError");
const { sendResults, sendResult } = require("./handlers/send");
const { playlistInfo } = require("youtube-ext");
// const youtubePlaylist = require("youtube-playlist");

/**
 * [getProfile, updateProfile] handled by userControllers;
 * - topMentors
 * - taughtCourses
 * - messages,
 * - chats,
 * - reviews;
 *
 */

const getPublicBasicInfo = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { id } = req.params;
  const result = (await Mentor.findById(id)).getPublicBasicInfo();
  sendResult(res, result);
});

const getTopMentors = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  const topMentors = await Mentor.find({
    _id: {
      $in: [
        "6713f76a0b796587d1b708eb",
        "67145ddfa1aac9da26edfab0",
        "67145978a1aac9da26edfa70",
      ],
    },
  }).select("fname lname headline title photo");
  sendResults(res, topMentors);
});

/** Taught courses [getAll, create, update, and delete one] */

const getAllTaughtCourses = catchAsyncMiddle(async function (
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
  const newCourse = new Course({ mentor: req.user._id, ...req.body });
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
  const { newCourse } = req.body;
  const { id, status } = newCourse;
  newCourse.mentor = newCourse.mentor || req.user._id; // for old courses;

  const index = req.user.taughtCourses.findIndex(
    (c) => c._id.toString() === id
  );
  if (index === -1) return next(new AppError("Course not found!", 404));
  const updatedCourse = await Course.findByIdAndUpdate(id, newCourse, {
    new: true,
    runValidators: status,
  });
  return sendResult(res, updatedCourse);
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
    return next(new AppError("Course not found in taughtCourses!", 404));

  req.user.taughtCourses.splice(index, 1);
  req.user.archivedTaughtCourses.push({ _id: id });
  await req.user.save();

  const course = await Course.findByIdAndUpdate(
    id,
    { isRemoved: true },
    {
      runValidators: false,
    }
  );
  if (!course) return next(new AppError("Course is already removed!", 404));

  return sendResult(res, undefined);
});

const getTaughtCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { id } = req.params;
  const index = req.user.taughtCourses.findIndex(
    (c) => c._id.toString() === id
  );
  if (index === -1)
    return next(new AppError("Course not found in taughtCourses!", 404));
  const course = (await req.user.populate("taughtCourses")).taughtCourses[
    index
  ];
  console.log(course);
  sendResult(res, course);
});

const youtubePlaylistExtractor = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  let { url, from, to } = req.body;
  [from, to] = [parseInt(from) || 1, parseInt(to)];

  console.log(from, to);

  try {
    const data = await playlistInfo(url, {});

    if (from > data.videos.length) {
      return next(
        new AppError("The start is bigger than playlist length!", 404)
      );
    }
    let results = {
      ...data,
      videos: [...(data.videos || [])].slice(from - 1, to ? to : undefined),
    };
    return sendResult(res, results);
  } catch (error) {
    console.log("youtubePlaylistExtractor err:", error);
    return next(new AppError("Failed to extract url!", 404));
  }
});

module.exports = {
  getTopMentors,
  getPublicBasicInfo,
  getAllTaughtCourses,
  createCourse,
  updateTaughtCourse,
  deleteTaughtCourse,
  getTaughtCourse,
  youtubePlaylistExtractor,
};
