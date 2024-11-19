const AppError = require("../utils/appError");
const Comment = require("../models/commentModel");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");
const { sendResults, sendResult } = require("./handlers/send");
const { structureComments } = require("../utils/structureComments");

const getAllCommentsOfCourse = catchAsyncMiddle(async function (
  req,
  res,
  next
) {});
const getAllCommentsOfLesson = catchAsyncMiddle(async function (
  req,
  res,
  next
) {
  const comments = await Comment.getCommentsPopulated(req.params.lessonId);
  const [structuredComments, count, deletedNestedComments] =
    structureComments(comments);

  // runs only once in case there was deleted nested comments - handled here instead of delete handler cause of...;
  if (deletedNestedComments.length) {
    await Comment.deleteMany({
      _id: {
        $in: deletedNestedComments,
      },
    });
  }

  sendResults(res, structuredComments, undefined, undefined, count);
});

const addComment = catchAsyncMiddle(async function (req, res, next) {
  console.log(req.body);

  let user = await req.user.populate([
    {
      path: "enrolledCourses._id",
      model: "Course",
      select: "title mentor",
    },
    {
      path: "archivedCourses._id",
      model: "Course",
      select: "title mentor",
    },
  ]);

  let course =
    user.enrolledCourses.find((e) => e && e._id.equals(req.body.course)) ||
    user.archivedCourses.find((e) => e && e._id.equals(req.body.course));

  if (!course)
    return next(
      new AppError("don't play with data bro, course isn't yours!", 403)
    );

  // get student form the database instead of the coming req to ensure data is for him LIKE course ^^;
  const author = req.user._id;
  const c = await Comment.create({ ...req.body, author });
  sendResult(res);
});

const updateComment = catchAsyncMiddle(async function (req, res, next) {
  const { commentId, content } = req.body;

  const comment = await Comment.findOne({ _id: commentId });

  if (!comment) {
    return next(new AppError("Comment not found!", 404));
  } else if (comment.author.toString() !== req.user._id.toString()) {
    return next(
      new AppError("don't play with data bro, comment isn't yours!", 403)
    );
  }

  // find again since the _id is indexed by default;
  const c = await Comment.findByIdAndUpdate(
    {
      _id: commentId,
    },
    { content, updatedAt: Date.now() }
  );
  sendResult(res, c);
});

// !!!
// NOT SECURE ENOUGH we neeed to handle the case of checking if the reply itself is already belong to the root comment...;
const deleteComment = catchAsyncMiddle(async function (req, res, next) {
  const { commentId } = req.params;

  const comment = await Comment.findOne({ _id: commentId });

  if (!comment) {
    return next(new AppError("Comment not found!", 404));
  } else if (comment.author.toString() !== req.user._id.toString()) {
    return next(
      new AppError("don't play with data bro, comment isn't yours!", 403)
    );
  }

  // the nested comments will be deleted on re-structing the comments in the next time
  // instead of re structring them again now which isn't better in perfromence
  await Comment.deleteMany({
    _id: {
      $in: [commentId],
    },
  });
  sendResult(res);
});

module.exports = {
  getAllCommentsOfCourse,
  getAllCommentsOfLesson,
  addComment,
  updateComment,
  deleteComment,
};
