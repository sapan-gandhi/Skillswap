/**
 * JWT Utilities
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Generate JWT token
 */
const generateToken = (userId, role = 'user') => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'fallback_secret_change_in_production',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Verify JWT token
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_change_in_production');
};

/**
 * Generate random token (for email verification, password reset)
 */
const generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Generate OTP (6-digit)
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Format user response (remove sensitive fields)
 */
const formatUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  const { password, emailVerificationToken, passwordResetToken, passwordResetExpires, socketId, __v, ...safe } = userObj;
  return safe;
};

module.exports = {
  generateToken,
  verifyToken,
  generateRandomToken,
  generateOTP,
  formatUser,
};
