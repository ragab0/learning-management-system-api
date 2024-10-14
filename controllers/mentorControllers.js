const ets = require("express");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");
const Mentor = require("../models/users/mentorModel");

/**
 * Top mentors
 * Mentor [courses, teachers, messages, chats, reviews];
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

const getCreatedCourses = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  const courses = "";
});
