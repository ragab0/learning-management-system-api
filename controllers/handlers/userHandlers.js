const ets = require("express");
const catchAsyncMiddle = require("../../utils/catchAsyncMiddle");
const Student = require("../../models/users/studentModel");
const Mentor = require("../../models/users/mentorModel");
const { sendResults, sendResult } = require("./send");

const collections = {
  student: Student,
  mentor: Mentor,
};

class UserControllers {
  /** BASIC info of */
  static getBasicInfoOf(role) {
    return catchAsyncMiddle(async function (
      req = ets.request,
      res = ets.response
    ) {
      const result = (
        await collections[role].findById(req.user._id)
      ).getBasicInfo();
      sendResult(res, result);
    });
  }

  static updateBasicInfoOf(role) {
    return catchAsyncMiddle(async function (
      req = ets.request,
      res = ets.response
    ) {
      const result = await collections[role].findByIdAndUpdate(
        req.user._id,
        req.body,
        { runValidators: true, new: true }
      );
      sendResult(res, result, 201);
    });
  }

  /* All info of */
  static getAllUsersOf(role) {
    return catchAsyncMiddle(async function (
      req = ets.request,
      res = ets.response
    ) {
      const users = await collections[role].find();
      sendResults(res, users);
    });
  }

  static getUserOf(role) {
    return catchAsyncMiddle(async function (
      req = ets.request,
      res = ets.response
    ) {
      const user = await collections[role].findOneById(req.params.id);
      sendResults(res, user);
    });
  }

  static createUserOf(role) {
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

  static updateUserOf(role) {
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

  static deleteUserOf(role) {
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
