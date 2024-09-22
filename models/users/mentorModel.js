const mongoose = require("mongoose");
const userSchema = require("./_globalUserSchema");
/**
 *  01 inherit the original object that passed to the schema;
 *  02 inherit the methods iheriting the prototype of this derived schema by the user schema;
 *
 */

const mentorSchema = new mongoose.Schema({
  // 01
  ...userSchema.obj,
  taughtCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  expertise: [String],
  rating: { type: Number, min: 0, max: 5 },
});
// 02;
mentorSchema.methods = userSchema.methods;

const Mentor = mongoose.model("Mentor", mentorSchema);
module.exports = Mentor;
