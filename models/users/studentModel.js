const mongoose = require("mongoose");
const userSchema = require("./_globalUserSchema");
/**
 *  01 inherit the original object that passed to the schema;
 *  02 inherit the methods iheriting the prototype of this derived schema by the user schema;
 *
 */

const studentSchema = new mongoose.Schema({
  // 01
  ...userSchema.obj,
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  progress: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      completedModules: [mongoose.Schema.Types.ObjectId],
      completedLessons: [mongoose.Schema.Types.ObjectId],
    },
  ],
  activeChatRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom" }],

  // reviews: [
  //   {
  //     courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  //     rating: { type: Number, min: 1, max: 5 },
  //     timestamp: { type: Date, default: Date.now },
  //     reviewText: String,
  //   },
  // ],
});
// 02;
studentSchema.methods = userSchema.methods;

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
