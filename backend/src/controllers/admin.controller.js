/**
 * Admin Controller
 * User management, analytics, exports
 */

const User = require('../models/User.model');
const SwapRequest = require('../models/SwapRequest.model');
const Feedback = require('../models/Feedback.model');

/**
 * GET /api/admin/users
 */
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, isBanned } = req.query;
    const query = {};
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];
    if (role) query.role = role;
    if (isBanned !== undefined) query.isBanned = isBanned === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      User.countDocuments(query),
    ]);

    res.json({ success: true, users, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * PUT /api/admin/ban/:id
 */
const banUser = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot ban admin.' });

    user.isBanned = !user.isBanned;
    user.banReason = user.isBanned ? reason || 'Violation of terms' : null;
    await user.save();

    res.json({ success: true, message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully.`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * GET /api/admin/swaps
 */
const getSwaps = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { status } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [swaps, total] = await Promise.all([
      SwapRequest.find(query)
        .populate('requester', 'name email')
        .populate('provider', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      SwapRequest.countDocuments(query),
    ]);

    res.json({ success: true, swaps, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * GET /api/admin/analytics
 */
const getAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const last30Days = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(now - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers, newUsersMonth, newUsersWeek,
      totalSwaps, pendingSwaps, completedSwaps,
      totalFeedback, avgRatingResult,
      bannedUsers,
      topSkills,
      swapsByStatus,
      recentActivity,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', createdAt: { $gte: last30Days } }),
      User.countDocuments({ role: 'user', createdAt: { $gte: last7Days } }),
      SwapRequest.countDocuments(),
      SwapRequest.countDocuments({ status: 'pending' }),
      SwapRequest.countDocuments({ status: 'completed' }),
      Feedback.countDocuments(),
      Feedback.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' } } }]),
      User.countDocuments({ isBanned: true }),
      User.aggregate([
        { $match: { isBanned: false } },
        { $unwind: '$skillsOffered' },
        { $group: { _id: '$skillsOffered', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      SwapRequest.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      SwapRequest.find()
        .populate('requester', 'name')
        .populate('provider', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('requester provider skillOffered skillRequested status createdAt'),
    ]);

    res.json({
      success: true,
      analytics: {
        users: { total: totalUsers, newThisMonth: newUsersMonth, newThisWeek: newUsersWeek, banned: bannedUsers },
        swaps: {
          total: totalSwaps,
          pending: pendingSwaps,
          completed: completedSwaps,
          byStatus: swapsByStatus.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
        },
        feedback: { total: totalFeedback, avgRating: avgRatingResult[0]?.avg?.toFixed(1) || 0 },
        topSkills: topSkills.map((s) => ({ skill: s._id, count: s.count })),
        recentActivity,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * GET /api/admin/export/users
 * Export users as CSV
 */
const exportUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('name email location skillsOffered skillsWanted rating completedSwaps isBanned createdAt');

    const headers = ['Name', 'Email', 'Location', 'Skills Offered', 'Skills Wanted', 'Rating', 'Completed Swaps', 'Banned', 'Joined'];
    const rows = users.map((u) => [
      u.name, u.email, u.location,
      u.skillsOffered.join('; '), u.skillsWanted.join('; '),
      u.rating, u.completedSwaps, u.isBanned,
      new Date(u.createdAt).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=skillswap_users.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Export failed.' });
  }
};

/**
 * PUT /api/admin/users/:id/role
 */
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) return res.status(400).json({ success: false, message: 'Invalid role.' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, message: 'Role updated.', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getUsers, banUser, getSwaps, getAnalytics, exportUsers, updateUserRole };
