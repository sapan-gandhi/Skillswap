const router = require('express').Router();
const { getProfile, getUserById, updateProfile, getNotifications, markNotificationsRead, getSkillSuggestions, deleteAccount } = require('../controllers/user.controller');
const { protect, optionalAuth } = require('../middleware/auth.middleware');
const { updateProfileValidation } = require('../middleware/validation.middleware');

router.get('/profile', protect, getProfile);
router.put('/update', protect, updateProfileValidation, updateProfile);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/read', protect, markNotificationsRead);
router.get('/skill-suggestions', protect, getSkillSuggestions);
router.delete('/account', protect, deleteAccount);
router.get('/:id', optionalAuth, getUserById);

module.exports = router;
