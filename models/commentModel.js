const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "A comment can't be empty!"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },
  replies: { type: Array, default: [] },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: Date,
});

commentSchema.index({ lesson: 1 });
commentSchema.index({ course: 1 });

commentSchema.statics.getCommentsPopulated = async function (lessonId) {
  try {
    const comments = await Comment.aggregate([
      {
        $match: {
          lesson: new mongoose.Types.ObjectId(lessonId),
        },
      },
      {
        // Lookup author details
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      {
        $unwind: "$authorDetails",
      },
      {
        $project: {
          _id: 1,
          content: 1,
          course: 1,
          lesson: 1,
          parent: 1,
          upvotes: 1,
          downvotes: 1,
          createdAt: 1,
          updatedAt: 1,
          replies: 1,
          "authorDetails._id": 1,
          "authorDetails.fname": 1,
          "authorDetails.lname": 1,
          "authorDetails.photo": 1,
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
    ]);

    return comments;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
