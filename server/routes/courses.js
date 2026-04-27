const express = require('express');
const router = express.Router();
const {
  getAllCourses, getCourse, enrollCourse, createCourse, updateCourse,
  deleteCourse, addModule, updateModule, deleteModule, completeModule,
  getTeacherCourses, publishCourse
} = require('../controllers/courseController');
const { protect, teacherOnly } = require('../middleware/auth');

router.get('/', getAllCourses);
router.get('/teacher', protect, teacherOnly, getTeacherCourses);
router.get('/:id', protect, getCourse);
router.post('/', protect, teacherOnly, createCourse);
router.put('/:id', protect, teacherOnly, updateCourse);
router.delete('/:id', protect, teacherOnly, deleteCourse);
router.post('/:id/enroll', protect, enrollCourse);
router.post('/:id/publish', protect, teacherOnly, publishCourse);
router.post('/:id/modules', protect, teacherOnly, addModule);
router.put('/:id/modules/:moduleId', protect, teacherOnly, updateModule);
router.delete('/:id/modules/:moduleId', protect, teacherOnly, deleteModule);
router.post('/modules/:moduleId/complete', protect, completeModule);

module.exports = router;
