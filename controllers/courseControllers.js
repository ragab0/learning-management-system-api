const ets = require("express");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");
const Course = require("../models/courseModel");
const AppError = require("../utils/appError");
const { sendResults, sendResult } = require("./handlers/send");

const getTopCourses = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  const topCourses = await Course.find({
    _id: {
      $in: [
        "67140d024eea75fbf7f4f15d",
        "6714658ca1aac9da26edfad1",
        "67147555a1aac9da26ee06b1",
      ],
    },
  }).populate({
    path: "mentor",
    select: "fname lname photo headline",
  });
  sendResults(res, topCourses);
});

const getCourses = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  let query;
  let {
    page,
    pageSize,
    rate,
    chapter: modules,
    price,
    sortBy,
    catg,
  } = req.query;
  // 01) pagination options:
  page = parseInt(req.query.page) || 1;
  pageSize = parseInt(req.query.pageSize) || 10;
  const skipCount = (page - 1) * pageSize;

  // 02) filter:
  const filterConditions = {
    isRemoved: false,
    status: true,
  };
  if (rate) filterConditions.rate = { $in: rate.split(",").map(Number) };
  if (modules)
    filterConditions.numberOfModules = {
      $in: modules.split(",").map((range) => {
        const [min, max] = range.split("-").map(Number);
        if (max) return { $gte: min, $lte: max };
        return { $gte: min };
      }),
    };
  if (price)
    filterConditions.price = {
      $in: price.split(",").map((range) => {
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
    .populate({
      path: "mentor",
      select: "fname lname photo headline",
    })
    .sort(sortCriteria)
    .skip(skipCount)
    .limit(pageSize);
  const totalCourses = await Course.countDocuments({
    isRemoved: { $ne: true },
  });
  const totalPages = Math.ceil(totalCourses / pageSize);
  sendResults(res, courses, page, totalPages);
});

const getCourse = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { courseId } = req.params;
  const course = await Course.findById(courseId).populate({
    path: "mentor",
    select: "fname lname photo headline",
  });
  if (!course) return next(new AppError("Course isn't exist!", 404));
  else if (course.isRemoved)
    return next(new AppError("Course is archived!", 404));
  sendResult(res, course);
});

// const createCourse = catchAsyncMiddle(async function (
//   req = ets.request,
//   res = ets.response
// ) {
//   console.log(req.user);

//   const course = await Course.create({ mentor: req.user._id, ...req.body });
//   req.user.taughtCourses.push(course._id);
//   await req.user.save();
//   sendResult(res, course);
// });

// const updateCourse = catchAsyncMiddle(async function (
//   req = ets.request,
//   res = ets.response,
//   next
// ) {
//   const { courseId } = req.params;
//   const { id } = req.body;
//   const course = await Course.findByIdAndUpdate(courseId || id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!course) return next(new AppError("Course isn't exist!", 404));
//   sendResult(res, course);
// });

// const deleteCourse = catchAsyncMiddle(async function (
//   req = ets.request,
//   res = ets.response,
//   next
// ) {
//   const { courseId } = req.params;
//   const { id } = req.body;
//   const course = await Course.findByIdAndDelete(courseId || id);

//   if (!course) return next(new AppError("Course isn't exist!", 404));
//   sendResult(res);
// });

module.exports = {
  getCourses,
  getTopCourses,
  getCourse,
  // createCourse,
  // updateCourse,
  // deleteCourse,
};
