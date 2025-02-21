const User = require("../models/user");
const Question = require("../models/questions");
const Answer = require("../models/answer");

const AddQuiz = async (req, res, next) => {
  try {
    const user = req.user;
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ msg: "Invalid quiz data" });
    }

    const optionTypeQuestions = [];
    const fillInTheBlankQuestions = [];

    let index1 = 1;
    let index2 = 1;
    questions.forEach((question) => {
      if (question.type === "multipleChoice") {
        optionTypeQuestions.push({
          questionNumber: index1++,
          questionText: question.text,
          options: question.options,
          correctOption: parseInt(question.answer),
        });
      } else if (question.type === "fillInTheBlank") {
        fillInTheBlankQuestions.push({
          questionNumber: index2++,
          questionText: question.text,
          correctAnswer: question.answer,
          caseSensitive: false,
        });
      }
    });

    const newQuiz = new Question({
      optionType: optionTypeQuestions,
      FillInTheBlank: fillInTheBlankQuestions,
      createdBy: user._id,
    });

    await newQuiz.save();

    await User.findByIdAndUpdate(
      user._id,
      { $push: { createdQuestions: newQuiz._id } },
      { new: true }
    );

    res.status(201).json({ msg: "Quiz created successfully", quiz: newQuiz });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  AddQuiz,
};
