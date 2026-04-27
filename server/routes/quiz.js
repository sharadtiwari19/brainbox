const express = require('express');
const router = express.Router();
const {
  getQuiz, getQuizByModule, submitQuiz, createQuiz,
  updateQuiz, deleteQuiz, getCourseQuizzes
} = require('../controllers/quizController');
const { protect, teacherOnly } = require('../middleware/auth');

router.get('/module/:moduleId', protect, getQuizByModule);
router.get('/course/:courseId', protect, teacherOnly, getCourseQuizzes);
router.get('/:id', protect, getQuiz);
router.post('/', protect, teacherOnly, createQuiz);
router.post('/:id/submit', protect, submitQuiz);
router.put('/:id', protect, teacherOnly, updateQuiz);
router.delete('/:id', protect, teacherOnly, deleteQuiz);

module.exports = router;
