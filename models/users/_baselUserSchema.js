/**
 * global && un-modeled schema that is get inherited from [studentSchema, mentorSchema, adminSchema];
 *
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: [true, "Please type the first name!"],
      minlength: 3,
    },
    lname: {
      type: String,
      required: [true, "Please type the last name!"],
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
      required: [true, "Please specify your role!"],
      validate: {
        validator: function (val) {
          return ["student", "mentor"].includes(val);
        },
        message: "`{VALUE}` must be either (student | mentor)",
      },
      enum: {
        values: ["student", "mentor"],
      },
    },
    passwordChangedAt: Date,
    photo: String,
    headline: String,
    language: String,
    links: Array(String),
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  }
  // ,{ discriminatorKey: "role" }
);

/**
 * schema middlwares (pre && post)
 * (have access to the un-selected fields since we are in the shcema not quireis);
 *
 */

// 01 hash the password whenever the password get modified;
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
  }
  next();
});

/**
 * instances mehtods that will be availbe/added into the all created docs prototype;
 * (we have no access to the un-selected fields since we are in quiries);
 *
 */

// 01 compare passwords;
userSchema.methods.comparePassword = async function (candiatePass, userPass) {
  console.log(candiatePass, userPass);

  return await bcrypt.compare(candiatePass, userPass);
};

// 02 check if password changed after the JWT created;
userSchema.methods.isPasswordChangedAfter = function (JWTTimestamp) {
  console.log(JWTTimestamp, this.passwordChangedAt);
  return this.passwordChangedAt && this.passwordChangedAt < JWTTimestamp;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
