const mongoose = require("mongoose");
const userSchema = require("./_globalUserSchema");
/**
 *  01 inherit the original object that passed to the schema;
 *  02 inherit the methods iheriting the prototype of this derived schema by the user schema;
 *
 */

const adminSchema = new mongoose.Schema({
  // 01
  ...userSchema.obj,
  permissions: [String],
});
// 02;
adminSchema.methods = userSchema.methods;

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
