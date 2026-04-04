/**
 * Authentication & Authorization Middleware
 */

const { verifyToken } = require('../utils/jwt.utils');
const User = require('../models/User.model');

/**
 * Protect routes - requires valid JWT
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header or cookie
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Get user from DB (select necessary fields)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Token invalid. User not found.' });
    }

    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: `Account banned. Reason: ${user.banReason || 'Violation of terms of service.'}`,
      });
    }

    // Update last active
    user.lastActive = new Date();
    await User.findByIdAndUpdate(decoded.id, { lastActive: new Date() });

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ success: false, message: 'Server error during authentication.' });
  }
};

/**
 * Admin only access
 */
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
  }
  next();
};

/**
 * Optional auth - attaches user if token present, continues without user if not
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select('-password');
      if (user && !user.isBanned) req.user = user;
    }
  } catch (err) {
    // Silently ignore token errors for optional auth
  }
  next();
};

module.exports = { protect, adminOnly, optionalAuth };
