/**
 * User Model
 * Core user schema with skills, ratings, and profile data
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never return password in queries by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    profilePhoto: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [300, 'Bio cannot exceed 300 characters'],
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    skillsOffered: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    skillsWanted: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    availability: {
      type: String,
      enum: ['weekdays', 'weekends', 'evenings', 'flexible', 'unavailable'],
      default: 'flexible',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    completedSwaps: {
      type: Number,
      default: 0,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    banReason: {
      type: String,
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    socketId: {
      type: String,
      default: null,
    },
    notifications: [
      {
        type: {
          type: String,
          enum: ['swap_request', 'swap_accepted', 'swap_rejected', 'swap_completed', 'new_message', 'system'],
        },
        message: String,
        relatedId: mongoose.Schema.Types.ObjectId,
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
userSchema.index({ skillsOffered: 1 });
userSchema.index({ skillsWanted: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isBanned: 1 });
userSchema.index({ rating: -1 });
userSchema.index({ completedSwaps: -1 });

// Text search index
userSchema.index(
  { name: 'text', skillsOffered: 'text', skillsWanted: 'text', bio: 'text', location: 'text' },
  { weights: { skillsOffered: 10, skillsWanted: 8, name: 5, bio: 2, location: 1 } }
);

// ─── Virtual: Profile URL ─────────────────────────────────────────────────────
userSchema.virtual('profilePhotoUrl').get(function () {
  if (this.profilePhoto) {
    return `${process.env.SERVER_URL || 'http://localhost:5000'}/uploads/${this.profilePhoto}`;
  }
  return null;
});

// ─── Pre-save: Hash password ──────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Method: Compare password ─────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Method: Add notification ─────────────────────────────────────────────────
userSchema.methods.addNotification = async function (type, message, relatedId = null) {
  this.notifications.unshift({ type, message, relatedId });
  // Keep only last 50 notifications
  if (this.notifications.length > 50) {
    this.notifications = this.notifications.slice(0, 50);
  }
  return this.save();
};

// ─── Static: Update rating ────────────────────────────────────────────────────
userSchema.statics.updateRating = async function (userId, newRating) {
  const user = await this.findById(userId);
  if (!user) return;
  const totalRating = user.rating * user.ratingCount + newRating;
  user.ratingCount += 1;
  user.rating = Math.round((totalRating / user.ratingCount) * 10) / 10;
  return user.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
