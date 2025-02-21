const Question = require("../models/questions");
const Answer = require("../models/answer");
const User = require("../models/user");

const getAllQuiz = async (req, res, next) => {
  try {
    const quizzes = await Question.find({})
      .populate("createdBy", "name")
      .select("_id createdBy optionType FillInTheBlank")
      .lean();

    const formattedQuizzes = quizzes.map((quiz, index) => ({
      quizNumber: index + 1,
      quizId: quiz._id,
      creatorName: quiz.createdBy?.name || "Unknown",
      totalMultipleChoice: quiz.optionType?.length || 0,
      totalFillInTheBlank: quiz.FillInTheBlank?.length || 0,
    }));

    res.status(200).json({ quizzes: formattedQuizzes });
  } catch (error) {
    next(error);
  }
};

const getQuizDetails = async (req, res, next) => {
  try {
    const quizId = req.params.id;

    const quiz = await Question.findById(quizId).populate("createdBy", "name");

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const quizDetails = {
      quizId: quiz._id,
      creatorName: quiz.createdBy.name,
      totalMultipleChoice: quiz.optionType.length,
      totalFillInTheBlank: quiz.FillInTheBlank.length,
      optionType: quiz.optionType,
      FillInTheBlank: quiz.FillInTheBlank,
    };

    res.status(200).json(quizDetails);
  } catch (error) {
    console.error("Error fetching quiz details:", error);
    next(error);
  }
};

const submitResponse = async (req, res, next) => {
  try {
    const { responses } = req.body;
    const userId = req.user.id;
    const questionId = req.params.id;
    // console.log(responses);
    // if (!responses || responses.length === 0) {
    //   return res.status(400).json({ error: "No responses provided." });
    // }

    const fillInTheBlankAnswers = responses
      .filter((resp) => resp.type === "FillInTheBlank")
      .map(({ questionNumber, answer }) => ({ questionNumber, answer }));

    const optionTypeAnswers = responses
      .filter((resp) => resp.type === "MCQ")
      .map(({ questionNumber, answer }) => ({
        questionNumber,
        selectedOption: answer,
      }));

    const newAnswer = new Answer({
      FillInTheBlank: fillInTheBlankAnswers,
      optionType: optionTypeAnswers,
      submittedBy: userId,
      question: questionId,
    });

    const savedAnswer = await newAnswer.save();

    await Question.findByIdAndUpdate(
      questionId,
      { $push: { answers: savedAnswer._id, submittedBy: userId } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      userId,
      {
        $push: { submittedQuestions: questionId, answers: savedAnswer._id },
      },
      { new: true }
    );

    res
      .status(200)
      .json({ msg: "Response submitted successfully", savedAnswer });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllQuiz, getQuizDetails, submitResponse };
