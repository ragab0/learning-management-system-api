// global parent, inherited from others;

const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: [true, "Please type a final name!"],
    minlength: 3,
  },
  lname: {
    type: String,
    required: [true, "Please type a last name!"],
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "Please type an email!"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please type a password!"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password!"],
    minlength: 8,
    select: false,
    validate: {
      validator: function (curr) {
        return curr === this.password;
      },
    },
  },
  role: {
    type: String,
    enum: {
      values: ["student", "mentor", "admin"],
      message: "Role is either: student, mentor, admin",
    },
    default: "student",
  },
  photo: String,
  headline: String,
  language: String,
  links: Array(String),
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

/**
 * instances mehtods;
 */

// 01 checking password;
userSchema.methods.checkPassword = async function (candiatePass, userPass) {
  // those params since the password not selected;
  return await bcrypt.compare(candiatePass, userPass);
};

// 02 check if password changed after the JWT created;
userSchema.methods.isPasswordChangedAfter = function (JWTTimestamp) {
  return this.passwordLastChange && this.passwordLastChange < JWTTimestamp;
};

module.exports = userSchema;
