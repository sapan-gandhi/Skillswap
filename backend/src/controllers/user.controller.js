/**
 * User Controller
 * Profile, skills, notifications
 */

const User = require('../models/User.model');
const { formatUser } = require('../utils/jwt.utils');
const { getRelatedSkills } = require('../utils/skillMatch.utils');
const path = require('path');
const fs = require('fs');

/**
 * GET /api/users/profile
 * Get current user profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * GET /api/users/:id
 * Get user by ID (public profile)
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      '-password -emailVerificationToken -passwordResetToken -notifications'
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (!user.isPublic && req.user?._id.toString() !== user._id.toString()) {
      return res.status(403).json({ success: false, message: 'This profile is private.' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * PUT /api/users/update
 */
const updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'bio', 'location', 'availability', 'skillsOffered', 'skillsWanted', 'isPublic'];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // Normalize skills to lowercase
    if (updates.skillsOffered) updates.skillsOffered = updates.skillsOffered.map((s) => s.toLowerCase().trim()).filter(Boolean);
    if (updates.skillsWanted) updates.skillsWanted = updates.skillsWanted.map((s) => s.toLowerCase().trim()).filter(Boolean);

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });

    res.json({ success: true, message: 'Profile updated!', user: formatUser(user) });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Update failed.' });
  }
};

/**
 * GET /api/users/notifications
 */
const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notifications');
    res.json({ success: true, notifications: user.notifications || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * PUT /api/users/notifications/read
 */
const markNotificationsRead = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $set: { 'notifications.$[].read': true },
    });
    res.json({ success: true, message: 'Notifications marked as read.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * GET /api/users/skill-suggestions
 * Get skill suggestions based on current user's skills
 */
const getSkillSuggestions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const allSkills = [...(user.skillsOffered || []), ...(user.skillsWanted || [])];
    const suggestions = new Set();

    for (const skill of allSkills) {
      const related = getRelatedSkills(skill);
      related.forEach((s) => suggestions.add(s));
    }

    // Remove skills user already has
    const existing = new Set(allSkills.map((s) => s.toLowerCase()));
    const filtered = [...suggestions].filter((s) => !existing.has(s));

    res.json({ success: true, suggestions: filtered.slice(0, 10) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * DELETE /api/users/account
 * Soft delete - ban own account (or actual deletion)
 */
const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ success: true, message: 'Account deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = {
  getProfile,
  getUserById,
  updateProfile,
  getNotifications,
  markNotificationsRead,
  getSkillSuggestions,
  deleteAccount,
};
