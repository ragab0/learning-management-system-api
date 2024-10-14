const ets = require("express");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");
const Course = require("../models/courseModel");
const AppError = require("../utils/appError");
const { sendResults, sendResult } = require("./handlers/send");

const getCourses = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  let query;
  let { page, pageSize, rates, modules, prices, sortBy } = req.query;
  // 01) pagination options:
  page = parseInt(req.query.page) || 1;
  pageSize = parseInt(req.query.pageSize) || 10;
  const skipCount = (page - 1) * pageSize;

  // 02) filter:
  const filterConditions = {};
  if (rates) filterConditions.rates = { $in: rates.split(",").map(Number) };
  if (modules)
    filterConditions.numberOfModules = {
      $in: modules.split(",").map((range) => {
        const [min, max] = range.split("-").map(Number);
        if (max) return { $gte: min, $lte: max };
        return { $gte: min };
      }),
    };
  if (prices)
    filterConditions.price = {
      $in: prices.split(",").map((range) => {
        const [min, max] = range.split("-").map(Number);
        if (max) return { $gte: min, $lte: max };
        return { $gte: min };
      }),
    };

  // 03) sort:
  const sortOptions = {
    title: { title: 1 },
    "-title": { title: -1 },
    price: { price: 1 },
    "-price": { price: -1 },
    rate: { rate: 1 },
    top: { totalStudents: 1 },
    recently: { createdAt: 1 },
  };
  const sortCriteria = sortOptions[sortBy] || { title: 1 };

  // Execute our query && get the total numbers;
  const courses = await Course.find(filterConditions)
    .sort(sortCriteria)
    .skip(skipCount)
    .limit(pageSize);
  const totalCourses = await Course.countDocuments();
  const totalPages = Math.ceil(totalCourses / pageSize);
  sendResults(res, courses, page, totalPages);
});

const getTopCourses = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  req.query.page = req.query.page || 1;
  req.query.pageSize = req.query.pageSize || 8;
  req.query.sortBy = "top";
  return getCourses(req, res);
  c;
});

const getCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { courseId } = req.params;
  const { id } = req.body;
  const course = await Course.findById(courseId || id);

  if (!course) return next(new AppError("Course isn't exist!", 404));
  sendResult(res, course);
});

const createCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  const course = await Course.create({ mentor: req.user._id, ...req.body });
  req.user.taughtCourses.push(course._id);
  await req.user.save();
  sendResult(res, course);
});

const updateCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { courseId } = req.params;
  const { id } = req.body;
  const course = await Course.findByIdAndUpdate(courseId || id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!course) return next(new AppError("Course isn't exist!", 404));
  sendResult(res, course);
});

const deleteCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { courseId } = req.params;
  const { id } = req.body;
  const course = await Course.findByIdAndDelete(courseId || id);

  if (!course) return next(new AppError("Course isn't exist!", 404));
  sendResult(res);
});

module.exports = {
  getCourses,
  getTopCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
};
