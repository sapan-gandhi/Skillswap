/**
 * SwapRequest Model
 * Represents a skill exchange request between two users
 */

const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skillOffered: {
      type: String,
      required: [true, 'Skill offered is required'],
      trim: true,
      lowercase: true,
    },
    skillRequested: {
      type: String,
      required: [true, 'Skill requested is required'],
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
    message: {
      type: String,
      maxlength: [500, 'Message cannot exceed 500 characters'],
      default: '',
    },
    scheduledDate: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    requesterFeedback: {
      type: Boolean,
      default: false,
    },
    providerFeedback: {
      type: Boolean,
      default: false,
    },
    // Chat messages associated with this swap
    chatRoomId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
swapRequestSchema.index({ requester: 1, status: 1 });
swapRequestSchema.index({ provider: 1, status: 1 });
swapRequestSchema.index({ status: 1, createdAt: -1 });
swapRequestSchema.index({ skillOffered: 1 });
swapRequestSchema.index({ skillRequested: 1 });

// ─── Virtual: isCompleted ─────────────────────────────────────────────────────
swapRequestSchema.virtual('isFullyReviewed').get(function () {
  return this.requesterFeedback && this.providerFeedback;
});

// ─── Pre-save: Generate chat room ID ─────────────────────────────────────────
swapRequestSchema.pre('save', function (next) {
  if (this.isNew && !this.chatRoomId) {
    // Create deterministic room ID from user IDs
    const ids = [this.requester.toString(), this.provider.toString()].sort();
    this.chatRoomId = `chat_${ids[0]}_${ids[1]}`;
  }
  next();
});

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);

module.exports = SwapRequest;
