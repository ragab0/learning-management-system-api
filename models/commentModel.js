// 01 reference of 1:ton;
// 02 the parent reference;

const mongoose = require("mongoose");

const commentSchema = {
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  lesson: { type: mongoose.Schema.Types.ObjectId },
  content: {
    type: String,
    required: [true, "A comment can't be empty!"],
  },
  createdAt: Date,
  updatedAt: Date,
};

const Comment = mongoose.Model("Comment", commentSchema);
module.exports = Comment;
