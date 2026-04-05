<div align="center">

# SkillSwap Platform

### A Production-Ready Peer-to-Peer Skill Exchange Web Application

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-6366f1?style=for-the-badge&logo=vercel)](https://skillswap-two-neon.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-API%20Live-22c55e?style=for-the-badge&logo=render)](https://skillswap-backend-j5aw.onrender.com/api/health)
[![License](https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)

<br />

**SkillSwap** is a full-stack web platform where people exchange skills with each other — no money involved, just mutual growth and genuine human connection. Built with the MERN stack, real-time Socket.io communication, AI-powered skill matching, and a complete admin dashboard.

<br />

![SkillSwap Banner](https://via.placeholder.com/900x400/0f172a/6366f1?text=SkillSwap+Platform)

</div>

---

## 📌 Table of Contents

- [Live Demo](#-live-demo)
- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Socket.io Events](#-socketio-events)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Security](#-security)
- [Screenshots](#-screenshots)
- [Author](#-author)

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| **Frontend (Vercel)** | https://skillswap-two-neon.vercel.app |
| **Backend API (Render)** | https://skillswap-backend-j5aw.onrender.com |
| **API Health Check** | https://skillswap-backend-j5aw.onrender.com/api/health |

> ⚠️ **Note:** The backend is hosted on Render's free tier. It may take 30–60 seconds to wake up on first request.

**Demo Credentials:**
| Role | Email | Password |
|------|-------|----------|
| Admin | sapgandhi811@gmail.com | admin123 |
| User | Register with any email | Your choice |

---

## 🎯 About the Project

SkillSwap solves a simple but powerful problem: **everyone has something to teach and something to learn.** Instead of paying for courses or tutors, users can find someone who knows what they want to learn and teach them something in return.

Whether it's trading React skills for Guitar lessons, or Python for Photography — SkillSwap makes it easy to find the perfect match, coordinate the exchange, and build a reputation through verified reviews.

**This project demonstrates:**
- Production-grade MERN stack architecture
- Real-time bidirectional communication with Socket.io
- AI-powered recommendation system using TF-IDF similarity scoring
- JWT-based authentication with role-based access control
- Complete admin dashboard with analytics and data export
- Responsive, modern UI built with Tailwind CSS

---

## ✨ Key Features

### 👤 User Features
| Feature | Description |
|---------|-------------|
| 🔐 Authentication | Secure register/login with JWT tokens and bcrypt password hashing |
| 👤 Profile Management | Full profile with photo upload, bio, location, and availability |
| 🎯 Skills System | Add/remove skills you offer and skills you want to learn |
| 🔍 Smart Search | Search users by skill with filters for availability, rating, and sort order |
| 🤖 AI Recommendations | TF-IDF based matching algorithm suggests the best swap partners |
| 📬 Swap Requests | Send, accept, reject, and complete skill exchange requests |
| 💬 Real-time Chat | Live messaging with typing indicators and read receipts |
| 🔔 Notifications | Instant in-app and email notifications for all swap activities |
| ⭐ Reviews & Ratings | Leave star ratings and written reviews after swap completion |
| 📊 Dashboard | Personal stats, recent swaps, and personalized recommendations |

### 🛡️ Admin Features
| Feature | Description |
|---------|-------------|
| 📈 Analytics Dashboard | Total users, swaps, ratings, and platform activity metrics |
| 👥 User Management | View, ban/unban users, and update roles |
| 🔄 Swap Monitoring | Monitor all swap requests with status filters |
| 📥 Data Export | Export user data to CSV for offline analysis |

### ⚡ Real-time Features
| Feature | Description |
|---------|-------------|
| 💬 Live Chat | Instant messaging between swap partners |
| ⌨️ Typing Indicators | See when the other person is typing |
| 🟢 Online Status | Real-time online/offline presence tracking |
| 🔔 Push Notifications | Instant swap request and status update alerts |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2 | UI Framework |
| Vite | 5.0 | Build Tool & Dev Server |
| Tailwind CSS | 3.3 | Utility-first Styling |
| React Router DOM | 6.20 | Client-side Routing |
| Axios | 1.6 | HTTP Client |
| Socket.io Client | 4.6 | Real-time Communication |
| React Hot Toast | 2.4 | Toast Notifications |
| date-fns | 2.30 | Date Formatting |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | JavaScript Runtime |
| Express.js | 4.18 | Web Framework |
| MongoDB | 7.0 | NoSQL Database |
| Mongoose | 8.0 | MongoDB ODM |
| Socket.io | 4.6 | Real-time Engine |
| JSON Web Token | 9.0 | Authentication |
| bcryptjs | 2.4 | Password Hashing |
| Multer | 1.4 | File Upload Handling |
| Nodemailer | 6.9 | Email Service |
| Helmet | 7.1 | Security Headers |
| express-rate-limit | 7.1 | API Rate Limiting |
| express-validator | 7.0 | Input Validation |

### Infrastructure
| Service | Purpose |
|---------|---------|
| MongoDB Atlas | Cloud Database |
| Render | Backend Hosting |
| Vercel | Frontend Hosting |
| Gmail SMTP | Email Delivery |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│              React + Vite (Vercel CDN)                       │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│   │  Pages   │ │ Context  │ │Services  │ │ Socket   │      │
│   │(13 pages)│ │Auth/Socket│ │  (API)   │ │  Client  │      │
│   └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘      │
└────────┼────────────┼────────────┼─────────────┼────────────┘
         │            │            │             │
         │         HTTP/REST    WebSocket        │
         ▼            ▼            ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                        SERVER LAYER                          │
│              Node.js + Express (Render)                      │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│   │  Routes  │ │Controllers│ │Middleware│ │ Socket.io│      │
│   │  (8)     │ │   (7)    │ │Auth/Valid│ │ Handler  │      │
│   └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘      │
└────────┼────────────┼────────────┼─────────────┼────────────┘
         │                         │
         ▼                         ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                         │
│              MongoDB Atlas (Cloud)                           │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│   │   User   │ │   Swap   │ │ Feedback │ │ Message  │      │
│   │  Model   │ │  Request │ │  Model   │ │  Model   │      │
│   └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
skillswap/
│
├── backend/                          # Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js    # Register, login, me
│   │   │   ├── user.controller.js    # Profile, notifications
│   │   │   ├── swap.controller.js    # Swap CRUD operations
│   │   │   ├── feedback.controller.js# Reviews & ratings
│   │   │   ├── search.controller.js  # Search + AI recommendations
│   │   │   ├── admin.controller.js   # Admin analytics & management
│   │   │   └── chat.controller.js    # Message history
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js    # JWT verification
│   │   │   ├── validation.middleware.js # Input validation
│   │   │   └── upload.middleware.js  # Multer file upload
│   │   ├── models/
│   │   │   ├── User.model.js         # User schema + indexes
│   │   │   ├── SwapRequest.model.js  # Swap schema
│   │   │   ├── Feedback.model.js     # Review schema
│   │   │   └── Message.model.js      # Chat message schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── swap.routes.js
│   │   │   ├── feedback.routes.js
│   │   │   ├── search.routes.js
│   │   │   ├── admin.routes.js
│   │   │   ├── chat.routes.js
│   │   │   └── upload.routes.js
│   │   ├── sockets/
│   │   │   └── socketHandler.js      # Socket.io event handlers
│   │   ├── utils/
│   │   │   ├── jwt.utils.js          # Token generation & verification
│   │   │   ├── email.utils.js        # Nodemailer email templates
│   │   │   ├── skillMatch.utils.js   # AI TF-IDF matching algorithm
│   │   │   └── seed.js               # Database seeder
│   │   └── server.js                 # Express app entry point
│   ├── uploads/                      # Profile photo storage
│   ├── .env.example
│   └── package.json
│
├── frontend/                         # React + Vite SPA
│   ├── src/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Auth state management
│   │   │   └── SocketContext.jsx     # Socket.io context
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx        # App shell with sidebar
│   │   │   └── AdminLayout.jsx       # Admin panel shell
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx       # Marketing homepage
│   │   │   ├── LoginPage.jsx         # Authentication
│   │   │   ├── RegisterPage.jsx      # Registration
│   │   │   ├── DashboardPage.jsx     # User dashboard
│   │   │   ├── ProfilePage.jsx       # Own profile view
│   │   │   ├── EditProfilePage.jsx   # Profile editor
│   │   │   ├── UserProfilePage.jsx   # Other user's profile
│   │   │   ├── SearchPage.jsx        # Skill discovery
│   │   │   ├── SwapsPage.jsx         # Swap management
│   │   │   ├── ChatPage.jsx          # Real-time messaging
│   │   │   ├── NotFoundPage.jsx      # 404 page
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx # Analytics
│   │   │       ├── AdminUsers.jsx     # User management
│   │   │       └── AdminSwaps.jsx     # Swap monitoring
│   │   ├── services/
│   │   │   ├── api.js                # Axios + all API calls
│   │   │   └── socket.js             # Socket.io client
│   │   ├── App.jsx                   # Routes + guards
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Global styles
│   ├── vercel.json                   # Vercel routing config
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

```bash
node --version   # v18.0.0 or higher
npm --version    # v8.0.0 or higher
```

You'll also need:
- [MongoDB](https://www.mongodb.com/try/download/community) installed locally **OR** a free [MongoDB Atlas](https://cloud.mongodb.com) account
- A Gmail account for email notifications (optional for development)

---

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/sapan-gandhi/skillswap.git
cd skillswap
```

**2. Setup Backend**

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your configuration (see [Environment Variables](#-environment-variables) section).

```bash
# Seed the database with demo data
npm run seed

# Start development server
npm run dev
```

✅ Backend running at `http://localhost:5000`

**3. Setup Frontend**

Open a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_UPLOADS_URL=http://localhost:5000/uploads
```

```bash
npm run dev
```

✅ Frontend running at `http://localhost:5173`

**4. Open the app**

Navigate to **http://localhost:5173** and login with demo credentials:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@test.com | admin123 |
| **User** | alice@test.com | test123 |
| **User** | bob@test.com | test123 |

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

```env
# ── Server ────────────────────────────────────
PORT=5000
NODE_ENV=development                    # development | production

# ── Database ──────────────────────────────────
MONGO_URI=mongodb://localhost:27017/skillswap
# Production: mongodb+srv://<user>:<pass>@cluster.mongodb.net/skillswap

# ── Authentication ────────────────────────────
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d

# ── CORS ──────────────────────────────────────
CLIENT_URL=http://localhost:5173        # Frontend URL

# ── Server URL (for file links) ───────────────
SERVER_URL=http://localhost:5000

# ── File Upload ───────────────────────────────
UPLOAD_PATH=uploads/
MAX_FILE_SIZE=5242880                   # 5MB in bytes

# ── Email (Gmail SMTP) ────────────────────────
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password    # Gmail App Password
EMAIL_FROM=SkillSwap <noreply@skillswap.com>
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_UPLOADS_URL=http://localhost:5000/uploads
```

> 💡 **Getting Gmail App Password:** Go to Google Account → Security → Enable 2FA → Search "App Passwords" → Generate for "Mail" → Use the 16-character code as `EMAIL_PASS`

---

## 📖 API Documentation

### Base URL
```
Development:  http://localhost:5000/api
Production:   https://skillswap-backend-j5aw.onrender.com/api
```

### Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

### 🔐 Auth Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | ❌ | Register new user |
| `POST` | `/auth/login` | ❌ | Login and get JWT token |
| `GET` | `/auth/me` | ✅ | Get current user info |
| `PUT` | `/auth/change-password` | ✅ | Change password |

**Register Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "location": "Mumbai, India"
}
```

**Login Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "skillsOffered": [],
    "skillsWanted": []
  }
}
```

---

### 👤 User Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/users/profile` | ✅ | Get own profile |
| `PUT` | `/users/update` | ✅ | Update profile & skills |
| `GET` | `/users/:id` | Optional | Get user by ID |
| `GET` | `/users/notifications` | ✅ | Get notifications |
| `PUT` | `/users/notifications/read` | ✅ | Mark all as read |
| `GET` | `/users/skill-suggestions` | ✅ | AI skill suggestions |

---

### 🔍 Search Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/search` | Optional | Search users by skill |
| `GET` | `/search/recommendations` | ✅ | AI-powered matches |
| `GET` | `/search/popular-skills` | ❌ | Trending skills |

**Search Query Parameters:**
```
?skill=react&availability=evenings&minRating=4&sort=rating&page=1&limit=12
```

---

### 🔄 Swap Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/swaps` | ✅ | Send swap request |
| `GET` | `/swaps` | ✅ | Get my swaps |
| `GET` | `/swaps/:id` | ✅ | Get swap details |
| `PUT` | `/swaps/:id` | ✅ | Update status (accept/reject/complete) |

**Create Swap Request:**
```json
{
  "providerId": "user_object_id",
  "skillOffered": "react",
  "skillRequested": "python",
  "message": "Hi! Would love to exchange skills.",
  "scheduledDate": "2024-12-25T10:00:00.000Z"
}
```

---

### ⭐ Feedback Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/feedback` | ✅ | Submit review after swap |
| `GET` | `/feedback/:userId` | ❌ | Get user's reviews |

---

### 💬 Chat Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/chat/conversations` | ✅ | Get all conversations |
| `GET` | `/chat/messages/:roomId` | ✅ | Get chat messages |

---

### 🛡️ Admin Endpoints

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| `GET` | `/admin/users` | ✅ | Admin only |
| `PUT` | `/admin/ban/:id` | ✅ | Admin only |
| `PUT` | `/admin/users/:id/role` | ✅ | Admin only |
| `GET` | `/admin/swaps` | ✅ | Admin only |
| `GET` | `/admin/analytics` | ✅ | Admin only |
| `GET` | `/admin/export/users` | ✅ | Admin only |

---

## 📡 Socket.io Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join_room` | `{ roomId }` | Join a chat room |
| `leave_room` | `{ roomId }` | Leave a chat room |
| `send_message` | `{ roomId, receiverId, content }` | Send a message |
| `typing` | `{ roomId, isTyping }` | Typing indicator |
| `mark_read` | `{ roomId }` | Mark messages as read |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `receive_message` | `Message object` | New incoming message |
| `user_typing` | `{ userId, name, isTyping }` | Typing indicator |
| `messages_read` | `{ roomId, userId }` | Messages read confirmation |
| `swap_notification` | `{ type, swap, message }` | Swap status update |
| `new_message_notification` | `{ roomId, sender, preview }` | Unread message alert |
| `user_online` | `{ userId, isOnline }` | Online/offline status |

---

## 🗄️ Database Schema

### User Schema
```javascript
{
  name: String,                    // Required, 2-50 chars
  email: String,                   // Required, unique, indexed
  password: String,                // Bcrypt hashed, 12 rounds
  role: Enum['user', 'admin'],     // Default: 'user'
  profilePhoto: String,            // Filename of uploaded photo
  bio: String,                     // Max 300 chars
  location: String,
  skillsOffered: [String],         // Indexed for search
  skillsWanted: [String],          // Indexed for search
  availability: Enum[...],         // flexible/weekdays/weekends/evenings
  rating: Number,                  // Average rating (0-5)
  ratingCount: Number,             // Total number of ratings
  completedSwaps: Number,
  isBanned: Boolean,
  isOnline: Boolean,
  lastActive: Date,
  notifications: [NotificationSchema]
}
```

### SwapRequest Schema
```javascript
{
  requester: ObjectId → User,
  provider: ObjectId → User,
  skillOffered: String,
  skillRequested: String,
  status: Enum['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
  message: String,                 // Max 500 chars
  scheduledDate: Date,
  completedAt: Date,
  chatRoomId: String,              // Auto-generated from user IDs
  requesterFeedback: Boolean,
  providerFeedback: Boolean
}
```

### Feedback Schema
```javascript
{
  swapId: ObjectId → SwapRequest,  // Unique constraint per user per swap
  fromUser: ObjectId → User,
  toUser: ObjectId → User,
  rating: Number,                  // 1-5
  comment: String,                 // Max 500 chars
  skillReviewed: String
}
```

### Message Schema
```javascript
{
  chatRoomId: String,              // Indexed
  sender: ObjectId → User,
  receiver: ObjectId → User,
  content: String,                 // Max 1000 chars
  messageType: Enum['text', 'image', 'system'],
  isRead: Boolean,
  readAt: Date
}
```

---

## 🚢 Deployment

### Database — MongoDB Atlas (Free)

1. Create account at [mongodb.com/atlas](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Create database user with password
4. Add `0.0.0.0/0` to Network Access
5. Get connection string → replace `<password>` and add `/skillswap`

### Backend — Render (Free)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect GitHub repo
4. Configure:
   ```
   Root Directory: backend
   Build Command:  npm install
   Start Command:  node src/server.js
   ```
5. Add all environment variables
6. Deploy

### Frontend — Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import GitHub repo
3. Configure:
   ```
   Framework:     Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Dir:    dist
   ```
4. Add environment variables:
   ```
   VITE_API_URL     = https://your-backend.onrender.com/api
   VITE_SOCKET_URL  = https://your-backend.onrender.com
   VITE_UPLOADS_URL = https://your-backend.onrender.com/uploads
   ```
5. Deploy

> ⚠️ Make sure `CLIENT_URL` on Render matches your exact Vercel domain.

---

## 🔒 Security

This project implements multiple layers of security:

| Security Measure | Implementation |
|-----------------|----------------|
| **Password Hashing** | bcrypt with 12 salt rounds |
| **Authentication** | JWT tokens with configurable expiry |
| **Authorization** | Role-based access control (user/admin) |
| **Input Validation** | express-validator on all POST/PUT endpoints |
| **Rate Limiting** | 200 req/15min globally, 20 req/15min for auth |
| **Security Headers** | Helmet.js (XSS, CSRF, clickjacking protection) |
| **CORS** | Configured for specific frontend origin only |
| **Ban System** | Banned users blocked at middleware level |
| **File Upload** | Type and size validation (images only, max 5MB) |

---

## 📸 Screenshots

### Landing Page
> Clean, modern hero section with skill tags and feature highlights

### User Dashboard
> Personal stats, recent swap requests, and AI-powered recommendations

### Skill Search
> Filter by skill, availability, and rating with grid view

### Real-time Chat
> Clean messaging interface with typing indicators

### Admin Dashboard
> Analytics charts, user management, and data export

---

## 🗺️ Roadmap

- [ ] OAuth (Google/GitHub) login
- [ ] Video calling integration for swap sessions
- [ ] Skill verification badges
- [ ] Mobile app (React Native)
- [ ] Advanced AI matching with NLP
- [ ] Scheduled session calendar integration
- [ ] Group skill exchange sessions
- [ ] Stripe integration for premium features

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please make sure to:
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update the README if needed

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this project for personal, educational, or commercial purposes with attribution.

---

## 👨‍💻 Author

<div align="center">

### Sapan Gandhi

**Full-Stack Developer | MERN Stack | React | Node.js**

[![Email](https://img.shields.io/badge/Email-sapgandhi811%40gmail.com-EA4335?style=for-the-badge&logo=gmail)](mailto:sapgandhi811@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-sapan--gandhi-181717?style=for-the-badge&logo=github)](https://github.com/sapan-gandhi)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/sapan-gandhi)

*Built with ❤️ and a lot of ☕*

</div>

---

<div align="center">

**If you found this project useful, please consider giving it a ⭐ on GitHub!**

*© 2024 Sapan Gandhi — SkillSwap Platform*

</div>
