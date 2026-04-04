/**
 * Feedback Controller
 */

const Feedback = require('../models/Feedback.model');
const SwapRequest = require('../models/SwapRequest.model');
const User = require('../models/User.model');

/**
 * POST /api/feedback
 */
const createFeedback = async (req, res) => {
  try {
    const { swapId, toUserId, rating, comment } = req.body;
    const fromUserId = req.user._id;

    const swap = await SwapRequest.findById(swapId);
    if (!swap) return res.status(404).json({ success: false, message: 'Swap not found.' });
    if (swap.status !== 'completed') return res.status(400).json({ success: false, message: 'Can only review completed swaps.' });

    const isRequester = swap.requester.toString() === fromUserId.toString();
    const isProvider = swap.provider.toString() === fromUserId.toString();
    if (!isRequester && !isProvider) return res.status(403).json({ success: false, message: 'Not a participant of this swap.' });

    // Check if already reviewed
    const existing = await Feedback.findOne({ swapId, fromUser: fromUserId });
    if (existing) return res.status(409).json({ success: false, message: 'Already submitted feedback for this swap.' });

    const feedback = await Feedback.create({
      swapId,
      fromUser: fromUserId,
      toUser: toUserId,
      rating,
      comment,
      skillReviewed: isRequester ? swap.skillRequested : swap.skillOffered,
    });

    // Update swap feedback flags
    if (isRequester) swap.requesterFeedback = true;
    else swap.providerFeedback = true;
    await swap.save();

    // Update user rating
    await User.updateRating(toUserId, rating);

    res.status(201).json({ success: true, message: 'Feedback submitted!', feedback });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, message: 'Already submitted feedback.' });
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * GET /api/feedback/:userId
 */
const getUserFeedback = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [feedback, total] = await Promise.all([
      Feedback.find({ toUser: req.params.userId })
        .populate('fromUser', 'name profilePhoto')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Feedback.countDocuments({ toUser: req.params.userId }),
    ]);

    res.json({ success: true, feedback, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { createFeedback, getUserFeedback };
