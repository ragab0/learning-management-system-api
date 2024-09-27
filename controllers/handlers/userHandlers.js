const ets = require("express");
const catchAsyncMiddle = require("../../utils/catchAsyncMiddle");
const Student = require("../../models/users/studentModel");
const Mentor = require("../../models/users/mentorModel");

class UserControllers {
  static collections = {
    student: Student,
    mentor: Mentor,
  };

  static getAllUsersOfRole(role) {
    return catchAsyncMiddle(async function (
      req = ets.request,
      res = ets.response
    ) {
      const users = await collections[role].find();
      res.status(200).json({
        status: "success",
        results: users.length,
        data: users,
      });
    });
  }

  static getUserOfRole(role) {
    return catchAsyncMiddle(async function (
      req = ets.request,
      res = ets.response
    ) {
      const user = await collections[role].findOneById(req.params.id);
      res.status(200).json({
        status: "success",
        data: user,
      });
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
