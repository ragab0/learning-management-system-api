const mongoose = require("mongoose");

const commentSchema = {
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course.modules.lessons",
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String,
  createdAt: Date,
  updatedAt: Date,
};

const Comment = mongoose.Model("Comment", commentSchema);
module.exports = Comment;
