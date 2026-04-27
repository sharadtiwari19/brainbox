const Quiz = require('../models/Quiz');
const User = require('../models/User');

exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select('-questions.correctAnswer -questions.explanation');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getQuizByModule = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ module: req.params.moduleId })
      .select('-questions.correctAnswer -questions.explanation');
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let correct = 0;
    const results = quiz.questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctAnswer;
      if (isCorrect) correct++;
      return {
        question: q.question,
        yourAnswer: answers[i],
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        options: q.options
      };
    });

    const score = Math.round((correct / quiz.questions.length) * 100);
    const passed = score >= quiz.passThreshold;

    const user = await User.findById(req.user._id);
    const alreadyPassed = user.quizResults.some(
      r => r.quiz?.toString() === quiz._id.toString() && r.passed
    );

    if (!alreadyPassed) {
      user.quizResults.push({ quiz: quiz._id, score, passed });
      if (passed) {
        user.points += quiz.pointsReward;
        if (!user.completedModules.includes(quiz.module)) {
          user.completedModules.push(quiz.module);
        }
      }
      await user.save();
    }

    res.json({ score, passed, correct, total: quiz.questions.length, results, pointsEarned: passed && !alreadyPassed ? quiz.pointsReward : 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const { title, courseId, moduleId, questions, passThreshold, pointsReward, timeLimit } = req.body;
    const existing = await Quiz.findOne({ module: moduleId });
    if (existing) {
      Object.assign(existing, { title, questions, passThreshold, pointsReward, timeLimit });
      await existing.save();
      return res.json(existing);
    }
    const quiz = await Quiz.create({
      title, course: courseId, module: moduleId,
      questions, passThreshold: passThreshold || 60,
      pointsReward: pointsReward || 50, timeLimit: timeLimit || 30
    });
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCourseQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
