const ets = require("express");
const catchAsyncMiddle = require("../../utils/catchAsyncMiddle");
const Student = require("../../models/users/studentModel");
const Mentor = require("../../models/users/mentorModel");
const { sendResults } = require("./send");

const collections = {
  student: Student,
  mentor: Mentor,
};
class UserControllers {
  static getBasicInfoOf(role) {
    return catchAsyncMiddle(async function (
      req = ets.request,
      res = ets.response,
      next
    ) {
      const result = (
        await collections[role].findById(req.user._id)
      ).getBasicInfo();
      res.status(200).json({
        status: "success",
        result,
      });
    });
  }

  static updateBasicInfoOf(role) {
    return catchAsyncMiddle(async function (
      req = ets.request,
      res = ets.response,
      next
    ) {
      const result = await collections[role].findByIdAndUpdate(
        req.user._id,
        req.body,
        { runValidators: true, new: true }
      );
      res.status(201).json({
        status: "success",
        user: result,
      });
    });
  }

  static getAllUsersOfRole(role) {
    return catchAsyncMiddle(async function (
      req = ets.request,
      res = ets.response
    ) {
      const users = await collections[role].find();
      sendResults(res, users);
    });
  }

  static getUserOfRole(role) {
    return catchAsyncMiddle(async function (
      req = ets.request,
      res = ets.response
    ) {
      const user = await collections[role].findOneById(req.params.id);
      sendResults(res, user);
    });
  }

  static createUserOfRole(role) {
    return catchAsyncMiddle(async function (
      req = ets.request,
      res = ets.response
    ) {
      const user = await collections[role].create(req.body);
      res.status(201).json({
        status: "success",
        data: user,
      });
    });
  }

  static updateUserOfRole(role) {
    return catchAsyncMiddle(async function (
      req = ets.request,
      res = ets.response
    ) {
      const user = await collections[role].findOneAndUpdate(
        req.params.id,
        req.body
      );
      res.status(200).json({
        status: "success",
        data: user,
      });
    });
  }

  static deleteUserOfRole(role) {
    return catchAsyncMiddle(async function (
      req = ets.request,
      res = ets.response
    ) {
      const user = await collections[role].findOneAndDelete(req.params.id);
      res.status(204).json({
        status: "success",
        data: null,
      });
    });
  }
}

module.exports = UserControllers;
