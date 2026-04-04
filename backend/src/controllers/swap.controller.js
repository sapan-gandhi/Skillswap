/**
 * Swap Controller
 * Manage skill swap requests
 */

const SwapRequest = require('../models/SwapRequest.model');
const User = require('../models/User.model');
const { sendEmail, emailTemplates } = require('../utils/email.utils');

/**
 * POST /api/swaps
 */
const createSwap = async (req, res) => {
  try {
    const { providerId, skillOffered, skillRequested, message, scheduledDate } = req.body;
    const requesterId = req.user._id;

    if (providerId === requesterId.toString()) {
      return res.status(400).json({ success: false, message: "You can't swap with yourself." });
    }

    const provider = await User.findById(providerId);
    if (!provider) return res.status(404).json({ success: false, message: 'Provider not found.' });
    if (provider.isBanned) return res.status(400).json({ success: false, message: 'User is unavailable.' });

    // Check for existing pending swap
    const existing = await SwapRequest.findOne({
      requester: requesterId,
      provider: providerId,
      status: 'pending',
    });
    if (existing) {
      return res.status(409).json({ success: false, message: 'You already have a pending swap request with this user.' });
    }

    const swap = await SwapRequest.create({
      requester: requesterId,
      provider: providerId,
      skillOffered,
      skillRequested,
      message,
      scheduledDate: scheduledDate || null,
    });

    await swap.populate(['requester', 'provider']);

    // Real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(providerId).emit('swap_notification', {
        type: 'swap_request',
        swap,
        message: `${req.user.name} wants to swap skills with you!`,
      });
    }

    // Add notification to provider
    await User.findByIdAndUpdate(providerId, {
      $push: {
        notifications: {
          $each: [{ type: 'swap_request', message: `${req.user.name} sent you a swap request.`, relatedId: swap._id }],
          $position: 0,
          $slice: 50,
        },
      },
    });

    // Email notification (non-blocking)
    const template = emailTemplates.swapRequest(req.user.name, skillOffered, skillRequested);
    sendEmail({ to: provider.email, ...template }).catch(console.error);

    res.status(201).json({ success: true, message: 'Swap request sent!', swap });
  } catch (error) {
    console.error('Create swap error:', error);
    res.status(500).json({ success: false, message: 'Failed to create swap request.' });
  }
};

/**
 * GET /api/swaps
 */
const getSwaps = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, type = 'all', page = 1, limit = 10 } = req.query;

    let query = {};
    if (type === 'sent') query.requester = userId;
    else if (type === 'received') query.provider = userId;
    else query.$or = [{ requester: userId }, { provider: userId }];

    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [swaps, total] = await Promise.all([
      SwapRequest.find(query)
        .populate('requester', 'name email profilePhoto skillsOffered rating')
        .populate('provider', 'name email profilePhoto skillsOffered rating')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      SwapRequest.countDocuments(query),
    ]);

    res.json({
      success: true,
      swaps,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * PUT /api/swaps/:id
 */
const updateSwap = async (req, res) => {
  try {
    const { status, scheduledDate } = req.body;
    const swap = await SwapRequest.findById(req.params.id).populate(['requester', 'provider']);

    if (!swap) return res.status(404).json({ success: false, message: 'Swap not found.' });

    const userId = req.user._id.toString();
    const isProvider = swap.provider._id.toString() === userId;
    const isRequester = swap.requester._id.toString() === userId;

    if (!isProvider && !isRequester) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    // Only provider can accept/reject
    if ((status === 'accepted' || status === 'rejected') && !isProvider) {
      return res.status(403).json({ success: false, message: 'Only the provider can accept or reject.' });
    }

    // Only participants can cancel
    if (status === 'cancelled' && !isProvider && !isRequester) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel.' });
    }

    // Only accepted swaps can be marked complete
    if (status === 'completed' && swap.status !== 'accepted') {
      return res.status(400).json({ success: false, message: 'Only accepted swaps can be completed.' });
    }

    swap.status = status;
    if (scheduledDate) swap.scheduledDate = scheduledDate;
    if (status === 'completed') swap.completedAt = new Date();

    await swap.save();

    // Update completedSwaps count
    if (status === 'completed') {
      await User.findByIdAndUpdate(swap.requester._id, { $inc: { completedSwaps: 1 } });
      await User.findByIdAndUpdate(swap.provider._id, { $inc: { completedSwaps: 1 } });
    }

    // Real-time notification
    const io = req.app.get('io');
    const notifyUserId = isProvider ? swap.requester._id.toString() : swap.provider._id.toString();
    if (io) {
      io.to(notifyUserId).emit('swap_notification', {
        type: `swap_${status}`,
        swap,
        message: `Your swap request has been ${status}.`,
      });
    }

    // Notification in DB
    const notifyMsg = `Your swap request was ${status} by ${req.user.name}.`;
    await User.findByIdAndUpdate(notifyUserId, {
      $push: {
        notifications: {
          $each: [{ type: `swap_${status}`, message: notifyMsg, relatedId: swap._id }],
          $position: 0,
          $slice: 50,
        },
      },
    });

    if (status === 'accepted') {
      const template = emailTemplates.swapAccepted(req.user.name, swap.skillOffered, swap.skillRequested);
      sendEmail({ to: swap.requester.email, ...template }).catch(console.error);
    }

    res.json({ success: true, message: `Swap ${status} successfully.`, swap });
  } catch (error) {
    console.error('Update swap error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * GET /api/swaps/:id
 */
const getSwapById = async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id)
      .populate('requester', 'name email profilePhoto skillsOffered rating')
      .populate('provider', 'name email profilePhoto skillsOffered rating');

    if (!swap) return res.status(404).json({ success: false, message: 'Swap not found.' });

    const userId = req.user._id.toString();
    if (swap.requester._id.toString() !== userId && swap.provider._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    res.json({ success: true, swap });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { createSwap, getSwaps, updateSwap, getSwapById };
