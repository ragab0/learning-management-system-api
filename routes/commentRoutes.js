const ets = require("express");
const commentControllers = require("../controllers/commentControllers");
const authControllers = require("../controllers/authControllers");

const router = ets.Router();

router
  .route("/lessons/:lessonId")
  .get(commentControllers.getAllCommentsOfLesson);
// router
//   .route("/courses/:courseId")
//   .get(commentControllers.getAllCommentsOfCourse);
// router
//   .route("/mentors/:mentorId")
//   .get(commentControllers.getAllCommentsOfMentor);

router.use(authControllers.protect, authControllers.assignableTo("student"));

router
  .route("/")
  .post(commentControllers.addComment)
  .patch(commentControllers.updateComment);
router.route("/:commentId").delete(commentControllers.deleteComment);

module.exports = router;
