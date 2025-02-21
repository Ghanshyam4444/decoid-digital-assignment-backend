const express = require("express");
const router = express.Router();
const myQuestions_controller = require("../controllers/myQuestions-controller");
const authMiddleware = require("../middlewares/auth-middleware");
router.use(express.json());
router.get(
  "/getMyAllQuiz",
  authMiddleware,
  myQuestions_controller.getMyAllQuiz
);
router.get(
  "/getAllAnswers/:quizId",
  authMiddleware,
  myQuestions_controller.getAllAnswers
);
router.post(
  "/getAnswerDetails/:answerId",
  authMiddleware,
  myQuestions_controller.getAnswerDetails
);

module.exports = router;
