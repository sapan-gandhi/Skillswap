/**
 * Search Controller
 * Skill-based user search with AI recommendations
 */

const User = require('../models/User.model');
const { getSkillRecommendations } = require('../utils/skillMatch.utils');

/**
 * GET /api/search
 * Search users by skills with filters
 */
const searchUsers = async (req, res) => {
  try {
    const { skill, availability, minRating, page = 1, limit = 12, sort = 'relevance' } = req.query;

    let query = { isBanned: false, isPublic: true };
    if (req.user) query._id = { $ne: req.user._id };

    // Skill filter
    if (skill && skill.trim()) {
      const skillRegex = new RegExp(skill.trim(), 'i');
      query.$or = [{ skillsOffered: skillRegex }, { name: skillRegex }, { bio: skillRegex }];
    }

    if (availability) query.availability = availability;
    if (minRating) query.rating = { $gte: parseFloat(minRating) };

    // Sort options
    const sortOptions = {
      relevance: { completedSwaps: -1, rating: -1 },
      rating: { rating: -1, ratingCount: -1 },
      newest: { createdAt: -1 },
      active: { lastActive: -1 },
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(query)
        .select('name bio location skillsOffered skillsWanted profilePhoto rating ratingCount completedSwaps availability lastActive isOnline')
        .sort(sortOptions[sort] || sortOptions.relevance)
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      users,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), limit: parseInt(limit) },
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, message: 'Search failed.' });
  }
};

/**
 * GET /api/search/recommendations
 * AI-powered skill match recommendations
 */
const getRecommendations = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Login to get recommendations.' });

    const currentUser = await User.findById(req.user._id);

    // Get candidates (excluding current user and banned)
    const candidates = await User.find({
      _id: { $ne: req.user._id },
      isBanned: false,
      isPublic: true,
      $or: [{ skillsOffered: { $exists: true, $ne: [] } }, { skillsWanted: { $exists: true, $ne: [] } }],
    }).select('name bio location skillsOffered skillsWanted profilePhoto rating completedSwaps availability lastActive isOnline');

    const recommendations = getSkillRecommendations(currentUser, candidates);

    res.json({ success: true, recommendations: recommendations.slice(0, 20) });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * GET /api/search/popular-skills
 */
const getPopularSkills = async (req, res) => {
  try {
    const result = await User.aggregate([
      { $match: { isBanned: false } },
      { $unwind: '$skillsOffered' },
      { $group: { _id: '$skillsOffered', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 30 },
    ]);
    res.json({ success: true, skills: result.map((r) => ({ skill: r._id, count: r.count })) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { searchUsers, getRecommendations, getPopularSkills };
