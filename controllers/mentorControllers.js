const ets = require("express");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");
const Mentor = require("../models/users/mentorModel");
const Course = require("../models/courseModel");
const { sendResults, sendResult } = require("./handlers/send");
const AppError = require("../utils/appError");
const { getYoutubePlaylistId } = require("youtube-ext/dist/utils");
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
  const { newCourse } = req.body;
  const { id, status } = newCourse;

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

  const course = await Course.findById(id);
  course.isRemoved = true;

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
  getAllTaughtCourses,
  createCourse,
  updateTaughtCourse,
  deleteTaughtCourse,
  getTaughtCourse,
  youtubePlaylistExtractor,
};
