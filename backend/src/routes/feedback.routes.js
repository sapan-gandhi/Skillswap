// feedback.routes.js
const feedbackRouter = require('express').Router();
const { createFeedback, getUserFeedback } = require('../controllers/feedback.controller');
const { protect } = require('../middleware/auth.middleware');
const { feedbackValidation } = require('../middleware/validation.middleware');

feedbackRouter.post('/', protect, feedbackValidation, createFeedback);
feedbackRouter.get('/:userId', getUserFeedback);

module.exports = feedbackRouter;
