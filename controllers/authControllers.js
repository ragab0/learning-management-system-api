const ets = require("express");
const { sign, verify } = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");
const AppError = require("../utils/appError");
const Student = require("../models/users/studentModel");
const Mentor = require("../models/users/mentorModel");
const Admin = require("../models/users/adminSchema");

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

/**
 *  AUTHintication controllers:
 *  == the signup controller - before auth;
 *  == the login controller - AUTH STEP 01 / 02;
 *  == the protectedRoutes controller - AUTH STEP 02 / 02;
 *
 */

function signToken(user = {}) {
  const payload = {
    id: user._id,
  };
  return sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

// AUTH 00 / 02;
const signup = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log("................", req.body);

  // 01) create a user based on the role either [mentor or student by default];
  let user;
  if (req.body.role === "mentor") {
    user = await Mentor.create(req.body);
  } else {
    user = await Student.create(req.body);
  }

  // 02) siggning him to a valid token;
  const token = await promisify(signToken)(user);

  // 03) sending back our final res;
  return res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

// AUTH 01 / 02;
const login = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  console.log("................", req.body);

  const { email, password, role } = req.body;

  // 01) check if email || password are provided;
  if (!email || !password) {
    next(new AppError("Please provide email and password!", 400));
  }

  // 02) trying to get the user based on his role;
  let user;
  if (role === "admin") {
    user = await Admin.findOne({ email });
  } else if (role === "mentor") {
    user = await Mentor.findOne({ email });
  } else {
    user = await Student.findOne({ email });
  }

  // 03) check if the user is already exist && is correct too;
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError("The email or password isn't correct!", 401)); //un-authorized;
  }

  // 04) Finally, signing a valid JWT && send it back as a res;
  const token = signToken(user);
  return res.status(201).json({
    status: "success",
    token,
  });
});

// AUTH 02 / 02
const protect = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  // 01) checking if the user is loged in - the token token is provided;
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return next(
      new AppError("You are not loged in! Please login to get access!", 401)
    );
  }

  // 02) verify the token otherwise.. JsonWebTokenError;
  const decoded = await promisify(verify)(token, JWT_SECRET);

  // 03) checking if the user/payload/id still same - the user [not deleted, updated] from/into the db;
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError("This token is no longer exist! Please login again!", 401)
    );
  }

  // 04) checking if the password has not been changed after the token iat;
  if (freshUser.isPasswordChangedAfter(decoded.iat)) {
    return next(
      new AppError("Password has been changed! Please login again!", 401)
    );
  }

  // 05) finally pass the current user to the next middle (authorization/checkingPermissions);
  req.user = freshUser;
  next();
});

/**
 *  Authorization controllers
 *  == the assignableTo - which is responsible for assigning specific types of users to specific actions;
 *     && it came after the protectedRoutes controller && before berforming the action itself (middle/method of action);
 */

const assignableTo = function (...roles) {
  return catchAsyncMiddle(async function (
    req = ets.request,
    _ = ets.response,
    next
  ) {
    const { role } = req.user;
    if (!roles.includes(role)) {
      return next(
        new AppError("You don't have permision to perfrom this action!", 403)
      );
    }
    next();
  });
};

/**
 *
 * == Logout - in case u didn't see me, good bey, good evening, good morning xDDDDD;
 * == forgotPassword;
 * ==
 *
 */

const logout = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  next();
});

const forgotPassword = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  next();
});

module.exports = {
  signup,
  login,
  protect,
  assignableTo,
  logout,
  forgotPassword,
};
