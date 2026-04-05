<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=6366f1&height=200&section=header&text=SkillSwap&fontSize=80&fontColor=ffffff&fontAlignY=35&desc=Peer-to-Peer%20Skill%20Exchange%20Platform&descAlignY=55&descSize=20&animation=fadeIn" width="100%"/>

<br/>

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=6366F1&center=true&vCenter=true&width=600&lines=Learn+Anything.+Teach+Everything.;Exchange+Skills%2C+Not+Money.;Built+with+MERN+Stack+%2B+Socket.io;Real-time+Chat+%2B+AI+Matching)](https://git.io/typing-svg)

<br/>

<p align="center">
  <a href="https://skillswap-two-neon.vercel.app">
    <img src="https://img.shields.io/badge/🌐%20Live%20Demo-Visit%20App-6366f1?style=for-the-badge&labelColor=0f172a" alt="Live Demo"/>
  </a>
  &nbsp;
  <a href="mailto:sapgandhi811@gmail.com">
    <img src="https://img.shields.io/badge/📧%20Contact-Author-ea4335?style=for-the-badge&labelColor=0f172a" alt="Contact"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=white&labelColor=0f172a"/>
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white&labelColor=0f172a"/>
  <img src="https://img.shields.io/badge/MongoDB-7.0-47A248?style=flat-square&logo=mongodb&logoColor=white&labelColor=0f172a"/>
  <img src="https://img.shields.io/badge/Socket.io-4.6-010101?style=flat-square&logo=socketdotio&logoColor=white&labelColor=0f172a"/>
  <img src="https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=0f172a"/>
  <img src="https://img.shields.io/badge/JWT-Auth-f59e0b?style=flat-square&logo=jsonwebtokens&logoColor=white&labelColor=0f172a"/>
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white&labelColor=0f172a"/>
  <img src="https://img.shields.io/badge/License-MIT-8b5cf6?style=flat-square&labelColor=0f172a"/>
</p>

</div>

---

<div align="center">

## 💡 What is SkillSwap?

</div>

> **SkillSwap** is a production-grade web platform that enables people to **exchange skills peer-to-peer** — completely free, no money involved. Trade your React knowledge for Guitar lessons. Swap Python expertise for Photography tips. Connect, learn, teach, and grow together.

<div align="center">

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│   👤 Alice knows React           👤 Bob knows Python             │
│   👤 Alice wants Python    ←→    👤 Bob wants React              │
│                                                                   │
│              ✨ Perfect Match — Let's Swap! ✨                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

</div>

---

## 📋 Table of Contents

<div align="center">

| | Section |
|:---:|:---|
| 🌐 | [Live Demo](#-live-demo) |
| ✨ | [Features](#-features) |
| 🛠️ | [Tech Stack](#%EF%B8%8F-tech-stack) |
| 🏗️ | [Architecture](#%EF%B8%8F-system-architecture) |
| 📁 | [Project Structure](#-project-structure) |
| 🚀 | [Getting Started](#-getting-started) |
| 🔧 | [Environment Variables](#-environment-variables) |
| 📖 | [API Reference](#-api-reference) |
| 📡 | [Socket Events](#-socketio-events) |
| 🚢 | [Deployment](#-deployment) |
| 🔒 | [Security](#-security) |
| 👨‍💻 | [Author](#-author) |

</div>

---

## 🌐 Live Demo

<div align="center">

| 🖥️ Service | 🔗 URL | 📊 Status |
|:---:|:---|:---:|
| **Frontend** | https://skillswap-two-neon.vercel.app | ![Live](https://img.shields.io/badge/●-Live-22c55e?style=flat-square) |
| **Backend API** | *Private — see deployment guide* | — |
| **Health Check** | *Private — see deployment guide* | — |

> ⚠️ Backend is on Render's free tier — first request may take **30–60 seconds** to wake up.

<br/>

### 🔑 Demo Credentials

| 👤 Role | 📧 Email | 🔑 Password |
|:---:|:---|:---:|
| 🛡️ **Admin** | *Contact owner for access* | *Not public* |
| 👤 **User** | Register with any real email | Your choice |

</div>

---

## ✨ Features

<div align="center">

### 👤 User Features

</div>

```
🔐  Authentication      →  Secure JWT login/register with bcrypt hashing
👤  Profile Builder     →  Photo upload, bio, location, availability settings
🎯  Skills Manager      →  Add skills you offer & skills you want to learn
🔍  Smart Discovery     →  Search users by skill with advanced filters
🤖  AI Recommendations  →  TF-IDF algorithm matches you with perfect partners
📬  Swap Requests       →  Send, accept, reject, and track exchange requests
💬  Real-time Chat      →  Instant messaging with typing indicators
🔔  Live Notifications  →  Socket.io powered instant alerts + email alerts
⭐  Reviews System      →  Star ratings and written reviews post-swap
📊  Personal Dashboard  →  Stats, recent activity, and smart suggestions
```

<div align="center">

### 🛡️ Admin Features

</div>

```
📈  Analytics Dashboard →  Users, swaps, ratings, platform activity metrics
👥  User Management     →  View all users, ban/unban, update roles
🔄  Swap Monitoring     →  Filter and inspect all swap requests
📥  CSV Export          →  Download complete user data for analysis
```

<div align="center">

### ⚡ Real-time Features

</div>

```
💬  Live Chat           →  WebSocket-powered instant messaging
⌨️  Typing Indicators   →  See when your partner is typing
🟢  Online Presence     →  Real-time online/offline status tracking
🔔  Push Notifications  →  Instant swap request and status alerts
```

---

## 🛠️ Tech Stack

<div align="center">

### Frontend

| Technology | Version | Role |
|:---:|:---:|:---|
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) | 18.2 | UI Framework |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | 5.0 | Build Tool |
| ![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white) | 3.3 | Styling |
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white) | 6.20 | Routing |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white) | 1.6 | HTTP Client |
| ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socketdotio&logoColor=white) | 4.6 | Real-time |

### Backend

| Technology | Version | Role |
|:---:|:---:|:---|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) | 18+ | Runtime |
| ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) | 4.18 | Framework |
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) | 7.0 | Database |
| ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white) | 8.0 | ODM |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) | 9.0 | Auth |
| ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socketdotio&logoColor=white) | 4.6 | Real-time |

### Infrastructure

| Service | Purpose |
|:---:|:---|
| ![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white) | Cloud Database |
| ![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=black) | Backend Hosting |
| ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white) | Frontend Hosting |
| ![Gmail](https://img.shields.io/badge/Gmail_SMTP-EA4335?style=flat-square&logo=gmail&logoColor=white) | Email Service |

</div>

---

## 🏗️ System Architecture

```
╔══════════════════════════════════════════════════════════════════╗
║                     🌐 CLIENT LAYER                              ║
║                  React + Vite (Vercel CDN)                       ║
║                                                                  ║
║   ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐  ║
║   │   13 Pages  │   │  2 Contexts │   │   Axios + Socket.io │  ║
║   │  + Layouts  │   │ Auth+Socket │   │      Services       │  ║
║   └──────┬──────┘   └──────┬──────┘   └──────────┬──────────┘  ║
╚══════════╪═════════════════╪════════════════════════╪════════════╝
           │                 │                        │
           │    HTTP/REST    │       WebSocket        │
           ▼                 ▼                        ▼
╔══════════════════════════════════════════════════════════════════╗
║                     ⚙️  SERVER LAYER                             ║
║                Node.js + Express (Render)                        ║
║                                                                  ║
║  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐    ║
║  │  Routes  │  │Controllers│  │   Auth   │  │  Socket.io   │    ║
║  │   (8)    │  │    (7)   │  │Middleware│  │   Handler    │    ║
║  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘    ║
╚═══════╪═════════════╪═════════════╪════════════════╪════════════╝
        │                           │                │
        ▼                           ▼                ▼
╔══════════════════════════════════════════════════════════════════╗
║                     🗄️  DATABASE LAYER                           ║
║                   MongoDB Atlas (Cloud)                          ║
║                                                                  ║
║   ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌──────────┐   ║
║   │   User   │  │ SwapRequest  │  │ Feedback │  │ Message  │   ║
║   │  Model   │  │    Model     │  │  Model   │  │  Model   │   ║
║   └──────────┘  └──────────────┘  └──────────┘  └──────────┘   ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 📁 Project Structure

```
📦 skillswap/
│
├── 📂 backend/
│   ├── 📂 src/
│   │   ├── 📂 config/
│   │   │   └── 📄 db.js                  # MongoDB connection & error handling
│   │   │
│   │   ├── 📂 controllers/               # Business logic layer
│   │   │   ├── 📄 auth.controller.js     # Register, login, password change
│   │   │   ├── 📄 user.controller.js     # Profile, skills, notifications
│   │   │   ├── 📄 swap.controller.js     # CRUD for swap requests
│   │   │   ├── 📄 feedback.controller.js # Ratings & reviews
│   │   │   ├── 📄 search.controller.js   # Search + AI recommendations
│   │   │   ├── 📄 admin.controller.js    # Analytics, ban, export
│   │   │   └── 📄 chat.controller.js     # Message history
│   │   │
│   │   ├── 📂 middleware/                # Request processing layer
│   │   │   ├── 📄 auth.middleware.js     # JWT verification + role check
│   │   │   ├── 📄 validation.middleware.js # Input sanitization
│   │   │   └── 📄 upload.middleware.js   # Multer file handler
│   │   │
│   │   ├── 📂 models/                    # MongoDB schemas
│   │   │   ├── 📄 User.model.js          # User + full-text search index
│   │   │   ├── 📄 SwapRequest.model.js   # Swap lifecycle model
│   │   │   ├── 📄 Feedback.model.js      # Review schema
│   │   │   └── 📄 Message.model.js       # Chat messages
│   │   │
│   │   ├── 📂 routes/                    # API route definitions
│   │   │   ├── 📄 auth.routes.js
│   │   │   ├── 📄 user.routes.js
│   │   │   ├── 📄 swap.routes.js
│   │   │   ├── 📄 feedback.routes.js
│   │   │   ├── 📄 search.routes.js
│   │   │   ├── 📄 admin.routes.js
│   │   │   ├── 📄 chat.routes.js
│   │   │   └── 📄 upload.routes.js
│   │   │
│   │   ├── 📂 sockets/
│   │   │   └── 📄 socketHandler.js       # All Socket.io event logic
│   │   │
│   │   ├── 📂 utils/
│   │   │   ├── 📄 jwt.utils.js           # Token generation & formatting
│   │   │   ├── 📄 email.utils.js         # HTML email templates
│   │   │   ├── 📄 skillMatch.utils.js    # 🤖 TF-IDF AI algorithm
│   │   │   └── 📄 seed.js               # Database seeder with demo data
│   │   │
│   │   └── 📄 server.js                  # Express app + Socket.io bootstrap
│   │
│   ├── 📂 uploads/                       # Profile photo storage
│   ├── 📄 .env.example
│   └── 📄 package.json
│
└── 📂 frontend/
    ├── 📂 src/
    │   ├── 📂 context/
    │   │   ├── 📄 AuthContext.jsx         # Global auth state + token mgmt
    │   │   └── 📄 SocketContext.jsx       # Real-time event distribution
    │   │
    │   ├── 📂 layouts/
    │   │   ├── 📄 MainLayout.jsx          # Sidebar + responsive shell
    │   │   └── 📄 AdminLayout.jsx         # Admin panel layout
    │   │
    │   ├── 📂 pages/
    │   │   ├── 📄 LandingPage.jsx         # 🏠 Marketing homepage
    │   │   ├── 📄 LoginPage.jsx           # 🔐 Auth forms
    │   │   ├── 📄 RegisterPage.jsx
    │   │   ├── 📄 DashboardPage.jsx       # 📊 User dashboard
    │   │   ├── 📄 ProfilePage.jsx         # 👤 Own profile
    │   │   ├── 📄 EditProfilePage.jsx     # ✏️  Profile editor + photo upload
    │   │   ├── 📄 UserProfilePage.jsx     # 👀 View others + swap request modal
    │   │   ├── 📄 SearchPage.jsx          # 🔍 Skill discovery + AI tab
    │   │   ├── 📄 SwapsPage.jsx           # 🔄 Swap management + feedback
    │   │   ├── 📄 ChatPage.jsx            # 💬 Real-time chat
    │   │   ├── 📄 NotFoundPage.jsx        # 404
    │   │   └── 📂 admin/
    │   │       ├── 📄 AdminDashboard.jsx  # 📈 Analytics + charts
    │   │       ├── 📄 AdminUsers.jsx      # 👥 User management table
    │   │       └── 📄 AdminSwaps.jsx      # 🔄 Swap monitoring table
    │   │
    │   ├── 📂 services/
    │   │   ├── 📄 api.js                  # Axios instance + all API calls
    │   │   └── 📄 socket.js              # Socket.io client singleton
    │   │
    │   ├── 📄 App.jsx                     # Routes + private/admin guards
    │   ├── 📄 main.jsx                    # React 18 entry point
    │   └── 📄 index.css                  # Tailwind + custom CSS variables
    │
    ├── 📄 vercel.json                     # SPA routing fix for Vercel
    ├── 📄 vite.config.js
    ├── 📄 tailwind.config.js
    └── 📄 package.json
```

---

## 🚀 Getting Started

### ✅ Prerequisites

```bash
node --version    # Requires v18.0.0+
npm --version     # Requires v8.0.0+
mongod --version  # Local MongoDB OR use Atlas free tier
```

---

### 📥 Installation

**Step 1 — Clone the repository**
```bash
git clone https://github.com/sapan-gandhi/skillswap.git
cd skillswap
```

**Step 2 — Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values (see Environment Variables section)
```

**Step 3 — Seed the database**
```bash
npm run seed
```

**Step 4 — Start the backend**
```bash
npm run dev
# ✅ Server: http://localhost:5000
```

**Step 5 — Setup Frontend** *(new terminal)*
```bash
cd ../frontend
npm install
cp .env.example .env
# Edit .env (defaults work for local dev)
```

**Step 6 — Start the frontend**
```bash
npm run dev
# ✅ App: http://localhost:5173
```

---

### 🔑 Demo Login (after seed)

```
┌──────────────────────────────────────────────┐
│  ADMIN                                        │
│  Email:    admin@test.com                     │
│  Password: (set via seed script)              │
├──────────────────────────────────────────────┤
│  USER                                         │
│  Email:    alice@test.com                     │
│  Password: (set via seed script)              │
└──────────────────────────────────────────────┘
```

---

## 🔧 Environment Variables

### Backend `.env`

```env
# ━━━━━━━━━━━━━━━━ SERVER ━━━━━━━━━━━━━━━━
PORT=5000
NODE_ENV=development

# ━━━━━━━━━━━━━━━━ DATABASE ━━━━━━━━━━━━━━
MONGO_URI=mongodb://localhost:27017/skillswap
# Production ↓
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/skillswap

# ━━━━━━━━━━━━━━━━ AUTH ━━━━━━━━━━━━━━━━━
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# ━━━━━━━━━━━━━━━━ CORS ━━━━━━━━━━━━━━━━━
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000

# ━━━━━━━━━━━━━━━━ EMAIL ━━━━━━━━━━━━━━━━
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=SkillSwap <noreply@skillswap.com>

# ━━━━━━━━━━━━━━━━ FILES ━━━━━━━━━━━━━━━━
UPLOAD_PATH=uploads/
MAX_FILE_SIZE=5242880
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_UPLOADS_URL=http://localhost:5000/uploads
```

> 💡 **Gmail App Password:** Google Account → Security → 2FA → App Passwords → Generate for Mail

---

## 📖 API Reference

**Base URL:**
```
Development  →  http://localhost:5000/api
Production   →  https://<your-render-backend-url>/api
```

**Auth Header:**
```
Authorization: Bearer <jwt_token>
```

---

### 🔐 Authentication

```
POST   /auth/register          →  Create new account
POST   /auth/login             →  Login, receive JWT
GET    /auth/me           🔒   →  Get current user
PUT    /auth/change-password 🔒 →  Update password
```

### 👤 Users

```
GET    /users/profile         🔒 →  Own profile
PUT    /users/update          🔒 →  Update profile & skills
GET    /users/:id             🔓 →  Any user's public profile
GET    /users/notifications   🔒 →  Get notifications
PUT    /users/notifications/read 🔒 → Mark all read
POST   /upload/profile-photo  🔒 →  Upload profile picture
```

### 🔍 Search & Discovery

```
GET    /search                🔓 →  Search users by skill + filters
GET    /search/recommendations 🔒 →  AI-powered match suggestions
GET    /search/popular-skills  🔓 →  Trending skills on platform
```

**Search Parameters:**
```
?skill=react
&availability=evenings
&minRating=4
&sort=rating|relevance|newest|active
&page=1
&limit=12
```

### 🔄 Swaps

```
POST   /swaps                 🔒 →  Send swap request
GET    /swaps                 🔒 →  My swaps (sent + received)
GET    /swaps/:id             🔒 →  Swap details
PUT    /swaps/:id             🔒 →  Accept/Reject/Complete/Cancel
```

### ⭐ Feedback

```
POST   /feedback              🔒 →  Submit review (post-swap only)
GET    /feedback/:userId      🔓 →  User's reviews & ratings
```

### 💬 Chat

```
GET    /chat/conversations    🔒 →  All conversations list
GET    /chat/messages/:roomId 🔒 →  Message history
```

### 🛡️ Admin (Admin Role Required)

```
GET    /admin/analytics       🔒🛡️ →  Platform statistics
GET    /admin/users           🔒🛡️ →  All users (paginated)
PUT    /admin/ban/:id         🔒🛡️ →  Ban or unban a user
PUT    /admin/users/:id/role  🔒🛡️ →  Change user role
GET    /admin/swaps           🔒🛡️ →  All swaps (paginated)
GET    /admin/export/users    🔒🛡️ →  Download CSV
```

> 🔒 = Requires JWT token &nbsp;&nbsp; 🔓 = Public &nbsp;&nbsp; 🛡️ = Admin only

---

## 📡 Socket.io Events

### Client → Server

```javascript
// Join a chat room
socket.emit('join_room', { roomId: 'chat_userId1_userId2' })

// Send a message
socket.emit('send_message', {
  roomId: 'chat_...',
  receiverId: 'user_object_id',
  content: 'Hey! Are you ready to swap?'
})

// Typing indicator
socket.emit('typing', { roomId: 'chat_...', isTyping: true })

// Mark messages read
socket.emit('mark_read', { roomId: 'chat_...' })
```

### Server → Client

```javascript
// New message received
socket.on('receive_message', (message) => { ... })

// Someone is typing
socket.on('user_typing', ({ name, isTyping }) => { ... })

// Swap status changed
socket.on('swap_notification', ({ type, swap, message }) => { ... })

// User came online/offline
socket.on('user_online', ({ userId, isOnline }) => { ... })

// New message in another chat
socket.on('new_message_notification', ({ roomId, sender, preview }) => { ... })
```

---

## 🚢 Deployment

<div align="center">

```
┌────────────────────────────────────────────────────┐
│                  Deployment Stack                   │
│                                                     │
│  ┌─────────────┐    ┌────────────┐    ┌──────────┐  │
│  │   Vercel    │    │   Render   │    │  MongoDB │  │
│  │  Frontend   │◄──►│  Backend   │◄──►│  Atlas   │  │
│  │  (React)    │    │  (Node.js) │    │ (Cloud)  │  │
│  └─────────────┘    └────────────┘    └──────────┘  │
└────────────────────────────────────────────────────┘
```

</div>

### 1️⃣ MongoDB Atlas
```
1. Create account → https://cloud.mongodb.com
2. New Project → Create Free M0 Cluster (Mumbai region for India)
3. Database Access → Add User → Username + Password
4. Network Access → Add IP → Allow from Anywhere (0.0.0.0/0)
5. Connect → Drivers → Copy connection string
6. Replace <password> and add /skillswap to the URI
```

### 2️⃣ Render (Backend)
```
1. https://render.com → New Web Service → Connect GitHub
2. Root Directory:  backend
3. Build Command:   npm install
4. Start Command:   node src/server.js
5. Add all environment variables
6. Deploy → Get your URL
```

### 3️⃣ Vercel (Frontend)
```
1. https://vercel.com → New Project → Import GitHub repo
2. Framework:       Vite
3. Root Directory:  frontend
4. Build Command:   npm run build
5. Add environment variables (use Render URL for VITE_API_URL)
6. Deploy → Get your URL
7. Update CLIENT_URL on Render to match Vercel URL
```

---

## 🔒 Security

```
╔═══════════════════════════════════════════════════════════╗
║                   Security Measures                        ║
╠═══════════════════════════════════════════════════════════╣
║  🔑  JWT Authentication     — Signed tokens, 7d expiry    ║
║  🔐  bcrypt Hashing         — 12 salt rounds on passwords  ║
║  ✅  Input Validation       — express-validator on all routes║
║  🚦  Rate Limiting          — 200 req/15min, 20 for auth   ║
║  🪖  Helmet.js              — Security headers (XSS, etc.) ║
║  🌐  CORS                   — Strict origin whitelist      ║
║  🚫  Ban System             — Middleware-level enforcement  ║
║  📁  File Validation        — Type + size checks (max 5MB) ║
╚═══════════════════════════════════════════════════════════╝
```

---

## 🗺️ Roadmap

- [x] JWT Authentication & Role-based Access
- [x] Real-time Chat with Socket.io
- [x] AI Skill Matching (TF-IDF)
- [x] Admin Dashboard with Analytics
- [x] Email Notifications
- [x] Profile Photo Upload
- [x] Full Production Deployment
- [ ] OAuth Login (Google / GitHub)
- [ ] Video Calling for Swap Sessions
- [ ] Mobile App (React Native)
- [ ] Calendar Integration for Scheduling
- [ ] Skill Verification Badges
- [ ] Group Skill Exchange Sessions

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

```bash
# Fork the repo and clone it
git clone https://github.com/YOUR_USERNAME/skillswap.git

# Create a feature branch
git checkout -b feature/your-amazing-feature

# Make your changes and commit
git commit -m "feat: add your amazing feature"

# Push and open a Pull Request
git push origin feature/your-amazing-feature
```

**Please follow these guidelines:**
- Write clean, commented code
- Test all changes before submitting
- Follow existing naming conventions
- Update docs if needed

---

## 📄 License

```
MIT License

Copyright (c) 2024 Sapan Gandhi

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software to use, copy, modify, merge, publish, distribute,
and/or sell copies of the Software without restriction.
```

---

<div align="center">

## 👨‍💻 Author

<img src="https://avatars.githubusercontent.com/sapan-gandhi" width="100" style="border-radius:50%"/>

### **Sapan Gandhi**

*Full-Stack Developer | MERN Stack Enthusiast*

[![Email](https://img.shields.io/badge/Gmail-sapgandhi811%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:sapgandhi811@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-sapan--gandhi-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sapan-gandhi)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/sapan-gandhi)

---

<img src="https://capsule-render.vercel.app/api?type=waving&color=6366f1&height=120&section=footer&text=Thanks%20for%20visiting!&fontSize=24&fontColor=ffffff&fontAlignY=65&animation=fadeIn" width="100%"/>

*If this project helped you, please give it a* ⭐ *on GitHub!*

*Built with ❤️ by Sapan Gandhi*

</div>
