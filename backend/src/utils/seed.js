/**
 * Database Seed Script
 * Creates demo users, swaps, and feedback for testing
 * Run: npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const SwapRequest = require('../models/SwapRequest.model');
const Feedback = require('../models/Feedback.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillswap';

const demoUsers = [
  {
    name: 'Admin User',
    email: 'sapgandhi811@gmail.com',
    password: 'admin123',
    role: 'admin',
    skillsOffered: ['project management', 'leadership'],
    skillsWanted: ['python', 'machine learning'],
    location: 'San Francisco, CA',
    availability: 'weekdays',
    bio: 'Platform administrator.',
  },
  {
    name: 'Alice Johnson',
    email: 'sapgandhi811+alice@gmail.com',
    password: 'password123',
    skillsOffered: ['react', 'javascript', 'ui/ux design'],
    skillsWanted: ['python', 'data science', 'guitar'],
    location: 'New York, NY',
    availability: 'evenings',
    bio: 'Frontend developer passionate about building great user experiences.',
    rating: 4.8,
    ratingCount: 12,
    completedSwaps: 12,
  },
  {
    name: 'Bob Martinez',
    email: 'sapgandhi811+bob@gmail.com',
    password: 'password123',
    skillsOffered: ['python', 'data science', 'machine learning'],
    skillsWanted: ['react', 'javascript', 'photography'],
    location: 'Austin, TX',
    availability: 'weekends',
    bio: 'Data scientist with 5 years of experience in ML and AI.',
    rating: 4.5,
    ratingCount: 8,
    completedSwaps: 8,
  },
  {
    name: 'Clara Lee',
    email: 'sapgandhi811+clara@gmail.com',
    password: 'password123',
    skillsOffered: ['guitar', 'music theory', 'piano'],
    skillsWanted: ['web development', 'graphic design'],
    location: 'Los Angeles, CA',
    availability: 'flexible',
    bio: 'Musician and music teacher. 10 years of experience.',
    rating: 4.9,
    ratingCount: 20,
    completedSwaps: 20,
  },
  {
    name: 'David Kim',
    email: 'sapgandhi811+david@gmail.com',
    password: 'password123',
    skillsOffered: ['photography', 'photo editing', 'videography'],
    skillsWanted: ['cooking', 'fitness', 'python'],
    location: 'Seattle, WA',
    availability: 'weekends',
    bio: 'Professional photographer specializing in portraits and landscapes.',
    rating: 4.7,
    ratingCount: 15,
    completedSwaps: 15,
  },
  {
    name: 'Emma Wilson',
    email: 'sapgandhi811+emma@gmail.com',
    password: 'password123',
    skillsOffered: ['cooking', 'baking', 'nutrition'],
    skillsWanted: ['photography', 'yoga', 'spanish'],
    location: 'Chicago, IL',
    availability: 'evenings',
    bio: 'Chef and food blogger. Specializing in Mediterranean cuisine.',
    rating: 4.6,
    ratingCount: 10,
    completedSwaps: 10,
  },
  {
    name: 'Frank Chen',
    email: 'sapgandhi811+frank@gmail.com',
    password: 'password123',
    skillsOffered: ['yoga', 'meditation', 'fitness'],
    skillsWanted: ['cooking', 'javascript', 'guitar'],
    location: 'Denver, CO',
    availability: 'weekdays',
    bio: 'Certified yoga instructor and wellness coach.',
    rating: 4.4,
    ratingCount: 7,
    completedSwaps: 7,
  },
  {
    name: 'Grace Thompson',
    email: 'sapgandhi811+grace@gmail.com',
    password: 'password123',
    skillsOffered: ['spanish', 'french', 'language teaching'],
    skillsWanted: ['machine learning', 'photography', 'cooking'],
    location: 'Miami, FL',
    availability: 'flexible',
    bio: 'Bilingual language tutor with 8 years of teaching experience.',
    rating: 4.8,
    ratingCount: 18,
    completedSwaps: 18,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await SwapRequest.deleteMany({});
    await Feedback.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = await User.create(demoUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    const [admin, alice, bob, clara, david, emma, frank, grace] = createdUsers;

    // Create swap requests
    const swaps = await SwapRequest.create([
      {
        requester: alice._id, provider: bob._id,
        skillOffered: 'react', skillRequested: 'python',
        status: 'completed', completedAt: new Date(),
        message: "Hi Bob! I'd love to learn Python in exchange for React lessons.",
        requesterFeedback: true, providerFeedback: true,
      },
      {
        requester: bob._id, provider: clara._id,
        skillOffered: 'python', skillRequested: 'guitar',
        status: 'accepted',
        message: 'Clara, would love to learn guitar!',
        scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        requester: david._id, provider: alice._id,
        skillOffered: 'photography', skillRequested: 'react',
        status: 'pending',
        message: 'Alice, I can teach photography if you teach me React!',
      },
      {
        requester: emma._id, provider: grace._id,
        skillOffered: 'cooking', skillRequested: 'spanish',
        status: 'completed', completedAt: new Date(),
        requesterFeedback: true, providerFeedback: true,
      },
      {
        requester: frank._id, provider: emma._id,
        skillOffered: 'yoga', skillRequested: 'cooking',
        status: 'pending',
        message: 'Emma, I offer yoga sessions in exchange for cooking lessons!',
      },
    ]);
    console.log(`✅ Created ${swaps.length} swap requests`);

    // Create feedback
    await Feedback.create([
      {
        swapId: swaps[0]._id, fromUser: alice._id, toUser: bob._id,
        rating: 5, comment: 'Bob is an amazing Python teacher! Very patient and knowledgeable.',
        skillReviewed: 'python',
      },
      {
        swapId: swaps[0]._id, fromUser: bob._id, toUser: alice._id,
        rating: 5, comment: 'Alice explained React concepts so clearly. Highly recommend!',
        skillReviewed: 'react',
      },
      {
        swapId: swaps[3]._id, fromUser: emma._id, toUser: grace._id,
        rating: 4, comment: 'Grace is a wonderful Spanish teacher. Looking forward to more sessions.',
        skillReviewed: 'spanish',
      },
      {
        swapId: swaps[3]._id, fromUser: grace._id, toUser: emma._id,
        rating: 5, comment: 'Emma taught me amazing Mediterranean recipes!',
        skillReviewed: 'cooking',
      },
    ]);
    console.log('✅ Created feedback');

    console.log('\n🎉 Seed complete!\n');
    console.log('📧 Admin login: admin@skillswap.com / admin123');
    console.log('📧 User login:  alice@example.com / password123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
