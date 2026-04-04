// auth.routes.js
const router = require('express').Router();
const { register, login, getMe, changePassword } = require('../controllers/auth.controller');
const { registerValidation, loginValidation } = require('../middleware/validation.middleware');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

module.exports = router;
