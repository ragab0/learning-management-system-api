const ets = require("express");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");

const getAllUsers = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response
) {
  // getUsers
  const users = "";

  // sendThem;
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

module.exports = {
  getAllUsers,
};
