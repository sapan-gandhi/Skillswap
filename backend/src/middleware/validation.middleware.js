/**
 * Input Validation Middleware using express-validator
 */

const { body, param, query, validationResult } = require('express-validator');

/**
 * Handle validation errors
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ─── Auth Validators ──────────────────────────────────────────────────────────
const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidation,
];

const loginValidation = [
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

// ─── User Validators ──────────────────────────────────────────────────────────
const updateProfileValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('bio').optional().isLength({ max: 300 }).withMessage('Bio cannot exceed 300 characters'),
  body('location').optional().trim().isLength({ max: 100 }).withMessage('Location too long'),
  body('availability')
    .optional()
    .isIn(['weekdays', 'weekends', 'evenings', 'flexible', 'unavailable'])
    .withMessage('Invalid availability option'),
  body('skillsOffered').optional().isArray().withMessage('Skills offered must be an array'),
  body('skillsWanted').optional().isArray().withMessage('Skills wanted must be an array'),
  handleValidation,
];

// ─── Swap Validators ──────────────────────────────────────────────────────────
const createSwapValidation = [
  body('providerId').isMongoId().withMessage('Invalid provider ID'),
  body('skillOffered').trim().notEmpty().withMessage('Skill offered is required'),
  body('skillRequested').trim().notEmpty().withMessage('Skill requested is required'),
  body('message').optional().isLength({ max: 500 }).withMessage('Message too long'),
  handleValidation,
];

const updateSwapValidation = [
  param('id').isMongoId().withMessage('Invalid swap ID'),
  body('status').isIn(['accepted', 'rejected', 'completed', 'cancelled']).withMessage('Invalid status'),
  handleValidation,
];

// ─── Feedback Validators ──────────────────────────────────────────────────────
const feedbackValidation = [
  body('swapId').isMongoId().withMessage('Invalid swap ID'),
  body('toUserId').isMongoId().withMessage('Invalid user ID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('comment').optional().isLength({ max: 500 }).withMessage('Comment too long'),
  handleValidation,
];

module.exports = {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  createSwapValidation,
  updateSwapValidation,
  feedbackValidation,
  handleValidation,
};
