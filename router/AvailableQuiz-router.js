const express = require("express");
const router = express.Router();
const AvailableQuiz_controller = require("../controllers/AvailableQuiz-Controller");
const authMiddleware = require("../middlewares/auth-middleware");
router.use(express.json());
router.get("/getAllQuiz", authMiddleware, AvailableQuiz_controller.getAllQuiz);
router.get(
  "/getQuizDetails/:id",
  authMiddleware,
  AvailableQuiz_controller.getQuizDetails
);
router.post(
  "/submitResponse/:id",
  authMiddleware,
  AvailableQuiz_controller.submitResponse
);

module.exports = router;
