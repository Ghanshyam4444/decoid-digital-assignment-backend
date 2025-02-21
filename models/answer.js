const mongoose = require("mongoose");

const AnswerSchema = mongoose.Schema({
  FillInTheBlank: [
    {
      questionNumber: { type: Number, required: true },
      answer: { type: String, required: true },
    },
  ],
  optionType: [
    {
      questionNumber: { type: Number, required: true },
      selectedOption: { type: Number, enum: [1, 2, 3, 4], required: true },
    },
  ],
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
});

const Answer = mongoose.model("Answer", AnswerSchema);
module.exports = Answer;
