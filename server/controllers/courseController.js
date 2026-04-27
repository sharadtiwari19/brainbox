const Course = require('../models/Course');
const User = require('../models/User');
const Quiz = require('../models/Quiz');

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate('teacher', 'name')
      .select('-modules.videoUrl');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('teacher', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const isEnrolled = course.enrolledStudents.includes(req.user._id);
    const isTeacher = course.teacher._id.toString() === req.user._id.toString();

    if (!isEnrolled && !isTeacher && req.user.role !== 'teacher') {
      const safeModules = course.modules.map((m, i) => ({
        ...m.toObject(),
        videoUrl: i === 0 || m.isPreview ? m.videoUrl : null,
        locked: i !== 0 && !m.isPreview
      }));
      return res.json({ ...course.toObject(), modules: safeModules, isEnrolled: false });
    }

    const user = await User.findById(req.user._id);
    const completedModuleIds = user.completedModules.map(id => id.toString());

    const modulesWithStatus = course.modules.map((m, i) => {
      const prevModuleCompleted = i === 0 || completedModuleIds.includes(course.modules[i - 1]._id.toString());
      return {
        ...m.toObject(),
        locked: !isTeacher && !prevModuleCompleted,
        completed: completedModuleIds.includes(m._id.toString())
      };
    });

    res.json({ ...course.toObject(), modules: modulesWithStatus, isEnrolled: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.enrolledStudents.includes(req.user._id))
      return res.status(400).json({ message: 'Already enrolled' });

    course.enrolledStudents.push(req.user._id);
    await course.save();

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { enrolledCourses: course._id }
    });

    res.json({ message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, level, thumbnail, tags } = req.body;
    const course = await Course.create({
      title, description, category, level, thumbnail,
      tags: tags || [], teacher: req.user._id
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.teacher.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    Object.assign(course, req.body);
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.teacher.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    await Course.findByIdAndDelete(req.params.id);
    await Quiz.deleteMany({ course: req.params.id });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addModule = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.teacher.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const { title, description, videoUrl, duration, isPreview } = req.body;
    const order = course.modules.length + 1;
    course.modules.push({ title, description, videoUrl, duration, order, isPreview });
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateModule = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.teacher.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const mod = course.modules.id(req.params.moduleId);
    if (!mod) return res.status(404).json({ message: 'Module not found' });

    Object.assign(mod, req.body);
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteModule = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.teacher.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    course.modules = course.modules.filter(m => m._id.toString() !== req.params.moduleId);
    await course.save();
    res.json({ message: 'Module deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.completeModule = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.completedModules.includes(req.params.moduleId)) {
      user.completedModules.push(req.params.moduleId);
      await user.save();
    }
    res.json({ message: 'Module marked complete', completedModules: user.completedModules });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTeacherCourses = async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user._id })
      .populate('enrolledStudents', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.publishCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.teacher.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    course.isPublished = !course.isPublished;
    await course.save();
    res.json({ isPublished: course.isPublished });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
