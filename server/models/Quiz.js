const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String, default: '' }
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  module: { type: mongoose.Schema.Types.ObjectId, required: true },
  questions: [questionSchema],
  passThreshold: { type: Number, default: 60 },
  pointsReward: { type: Number, default: 50 },
  timeLimit: { type: Number, default: 30 }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
