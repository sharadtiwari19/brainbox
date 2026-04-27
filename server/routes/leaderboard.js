const express = require('express');
const router = express.Router();
const { getLeaderboard, getMyRank } = require('../controllers/leaderboardController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getLeaderboard);
router.get('/my-rank', protect, getMyRank);

module.exports = router;
