const router = require('express').Router();
const { searchUsers, getRecommendations, getPopularSkills } = require('../controllers/search.controller');
const { optionalAuth, protect } = require('../middleware/auth.middleware');

router.get('/', optionalAuth, searchUsers);
router.get('/recommendations', protect, getRecommendations);
router.get('/popular-skills', getPopularSkills);

module.exports = router;
