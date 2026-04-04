/**
 * Auth Controller
 * Registration, Login, Profile management
 */

const User = require('../models/User.model');
const { generateToken, formatUser } = require('../utils/jwt.utils');
const { sendEmail, emailTemplates } = require('../utils/email.utils');

/**
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { name, email, password, location } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    // Create user
    const user = await User.create({ name, email, password, location: location || '' });

    // Send welcome email (non-blocking)
    const template = emailTemplates.welcome(name);
    sendEmail({ to: email, ...template }).catch(console.error);

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: formatUser(user),
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already exists.' });
    }
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Check if banned
    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: `Account suspended. Reason: ${user.banReason || 'Terms violation.'}`,
      });
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: formatUser(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
};

/**
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    res.json({ success: true, user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * POST /api/auth/change-password
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { register, login, getMe, changePassword };
