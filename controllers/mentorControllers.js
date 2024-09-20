const ets = require("express");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");

const getAllMentors = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  // getMentors
  const mentors = "";

  // sendThem;
  res.status(200).json({
    status: "success",
    results: mentors.length,
    data: {
      mentors,
    },
  });
});

module.exports = {
  getAllMentors,
};
