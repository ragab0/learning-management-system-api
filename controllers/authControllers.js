const ets = require("express");
const { sign, verify } = require("jsonwebtoken");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");
const AppError = require("../utils/appError");
const Student = require("../models/users/studentModel");
const Mentor = require("../models/users/mentorModel");
const Admin = require("../models/users/adminSchema");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });
const { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } = process.env;

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
    role: user.role,
  };
  return sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

function sendToken(res, statusCode, token) {
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + parseInt(JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    secure: NODE_ENV !== "development",
    httpOnly: true,
  });

  res.status(statusCode).json({
    status: "success",
    token,
  });
}

/* AUTH 00 / 02; */
const signup = catchAsyncMiddle(async function (req, res, next) {
  // 01) create a user based on the role either [mentor or student by default];
  const user =
    req.body.role === "mentor"
      ? await Mentor.create(req.body)
      : await Student.create(req.body);

  // 02) siggning him to a valid token && sending it back as our final res
  const token = signToken(user);
  sendToken(res, 201, token);
});

/* AUTH 01 / 02; */
const login = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  const { email, password, role } = req.body;

  // 01) is email || password provided;
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // 02) get it based based on his role;
  let user;
  if (role === "admin") {
    user = await Admin.findOne({ email }).select("+password");
  } else if (role === "mentor") {
    user = await Mentor.findOne({ email }).select("+password");
  } else {
    user = await Student.findOne({ email }).select("+password");
  }

  // 03) is he already exist && correct too; // otherwise un-authorized
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("The email or password isn't correct!", 401));
  }

  // 04) Finally, signing a valid JWT && send it back as a res;
  const token = signToken(user);
  sendToken(res, 201, token);
});

/* AUTH 02 / 02 */
const protect = catchAsyncMiddle(async function (
  req = ets.request,
  res = ets.response,
  next
) {
  // 01) checking if the user is loged in - is authonticated - the token is provided;
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return next(new AppError("Please login to get access!", 401));
  }

  // 02) verify the token otherwise.. JsonWebTokenError;
  const decoded = await promisify(verify)(token, JWT_SECRET);
  console.log(decoded);

  // 03) checking if the user/payload/id still same - the user [not deleted, updated] from/into the db;
  const freshUser =
    (await Admin.findById(decoded.id)) || (await Mentor.findById(decoded.id));
  if (!freshUser) {
    return next(new AppError("Please login again!", 401));
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
