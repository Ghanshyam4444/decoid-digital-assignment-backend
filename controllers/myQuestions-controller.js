const Quiz = require("../models/questions");
const Answer = require("../models/answer");
const User = require("../models/user");

const getMyAllQuiz = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const quizzes = await Quiz.find({ createdBy: userId }).select("_id");

    const quizData = await Promise.all(
      quizzes.map(async (quiz) => {
        const quizId = quiz._id;

        const totalAnswers = await Answer.countDocuments({ question: quizId });

        const quizDetails = await Quiz.findById(quizId).select(
          "optionType FillInTheBlank"
        );

        return {
          quizId,
          totalAnswers,
          totalMCQs: quizDetails.optionType.length,
          totalFillInTheBlanks: quizDetails.FillInTheBlank.length,
        };
      })
    );

    return res.status(200).json({ quizzes: quizData });
  } catch (error) {
    next(error);
  }
};

const getAllAnswers = async (req, res, next) => {
  try {
    const { quizId } = req.params;

    const answers = await Answer.find({ question: quizId }).populate(
      "submittedBy",
      "username"
    );

    const response = answers.map((ans) => ({
      answerId: ans._id,
      username: ans.submittedBy.username,
    }));

    res.status(200).json({ success: true, answers: response });
  } catch (error) {
    console.error("Error fetching answers:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getAnswerDetails = async (req, res, next) => {
  try {
    const { answerId } = req.params;
    const { questionId } = req.body;

    if (!answerId || !questionId) {
      return res
        .status(400)
        .json({ message: "answerId and questionId are required" });
    }

    const answer = await Answer.findById(answerId).populate(
      "submittedBy",
      "username"
    );

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const question = await Quiz.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({
      answerDetails: answer,
      questionDetails: question,
      submittedBy: answer.submittedBy.username,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyAllQuiz, getAllAnswers, getAnswerDetails };
