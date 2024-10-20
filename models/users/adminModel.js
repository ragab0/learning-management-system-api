const mongoose = require("mongoose");
const User = require("./_baselUserSchema");

const adminSchema = new mongoose.Schema({
  permissions: [String],
});

adminSchema.methods.getBasicInfo = function () {
  return this;
};

const Admin = User.discriminator("Admin", adminSchema);
module.exports = Admin;
