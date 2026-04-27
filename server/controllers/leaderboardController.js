const User = require('../models/User');

exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' })
      .select('name points enrolledCourses completedModules')
      .sort({ points: -1 })
      .limit(50);

    const leaderboard = users.map((u, i) => ({
      rank: i + 1,
      _id: u._id,
      name: u.name,
      points: u.points,
      coursesEnrolled: u.enrolledCourses.length,
      modulesCompleted: u.completedModules.length
    }));

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyRank = async (req, res) => {
  try {
    const myPoints = req.user.points;
    const rank = await User.countDocuments({ role: 'student', points: { $gt: myPoints } }) + 1;
    res.json({ rank, points: myPoints });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
