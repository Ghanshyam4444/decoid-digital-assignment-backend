const mongoose = require("mongoose");

const QuestionSchema = mongoose.Schema({
  optionType: [
    {
      questionNumber: { type: Number, required: true },
      questionText: { type: String, required: true },
      options: { type: [String], default: ["", "", "", ""] },
      correctOption: { type: Number, enum: [1, 2, 3, 4], required: true },
    },
  ],
  FillInTheBlank: [
    {
      questionNumber: { type: Number, required: true },
      questionText: { type: String, required: true },
      correctAnswer: { type: String, required: true },
      caseSensitive: { type: Boolean, default: false },
    },
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
  submittedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Question = mongoose.model("Question", QuestionSchema);
module.exports = Question;
