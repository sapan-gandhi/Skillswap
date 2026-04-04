#!/bin/bash
# SkillSwap Platform - Full Setup Script
# Run this once after extracting the ZIP

set -e

echo ""
echo "╔════════════════════════════════════════╗"
echo "║   SkillSwap Platform - Setup Script    ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Install from https://nodejs.org (v18+)"
  exit 1
fi

NODE_VER=$(node -v)
echo "✅ Node.js $NODE_VER detected"

# Check MongoDB
if ! command -v mongod &> /dev/null; then
  echo "⚠️  MongoDB not found locally. Make sure MongoDB is running or use Atlas URI in .env"
fi

echo ""
echo "── Backend Setup ──────────────────────────"
cd backend

# Copy .env if not exists
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created backend/.env from example"
  echo "   👉 Edit backend/.env with your MONGO_URI and JWT_SECRET"
fi

echo "📦 Installing backend dependencies..."
npm install --silent
echo "✅ Backend dependencies installed"

echo ""
echo "── Frontend Setup ─────────────────────────"
cd ../frontend

if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created frontend/.env from example"
fi

echo "📦 Installing frontend dependencies..."
npm install --silent
echo "✅ Frontend dependencies installed"

echo ""
echo "── Database Seed ──────────────────────────"
cd ../backend
echo "🌱 Seeding database with demo data..."
npm run seed

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    ✅ SETUP COMPLETE!                      ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║  Start backend:   cd backend && npm run dev                ║"
echo "║  Start frontend:  cd frontend && npm run dev               ║"
echo "║                                                            ║"
echo "║  App URL:         http://localhost:5173                    ║"
echo "║  API URL:         http://localhost:5000                    ║"
echo "║                                                            ║"
echo "║  Demo Admin:      admin@skillswap.com / admin123           ║"
echo "║  Demo User:       alice@example.com / password123          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
