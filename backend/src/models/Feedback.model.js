/**
 * Feedback Model
 * User ratings and reviews after swap completion
 */

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    swapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SwapRequest',
      required: true,
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
      default: '',
    },
    skillReviewed: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
feedbackSchema.index({ swapId: 1, fromUser: 1 }, { unique: true }); // One feedback per swap per user
feedbackSchema.index({ toUser: 1, rating: -1 });
feedbackSchema.index({ fromUser: 1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
