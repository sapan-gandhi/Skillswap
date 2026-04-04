# SkillSwap Platform 🔄

> A production-ready, full-stack Peer-to-Peer Skill Exchange Platform built with the MERN stack + Socket.io.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Real-time | Socket.io |
| File Upload | Multer |
| Email | Nodemailer |
| AI Matching | Custom TF-IDF skill similarity |

---

## 📁 Project Structure

```
skillswap/
├── backend/
│   ├── src/
│   │   ├── config/         # DB connection
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, validation, upload
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routers
│   │   ├── sockets/        # Socket.io handlers
│   │   ├── utils/          # JWT, email, AI matching, seeder
│   │   └── server.js       # Entry point
│   ├── uploads/            # Profile photo storage
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── context/        # Auth + Socket contexts
    │   ├── layouts/        # MainLayout, AdminLayout
    │   ├── pages/          # All page components
    │   │   └── admin/      # Admin panel pages
    │   ├── services/       # Axios API + socket service
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    └── package.json
```

---

## ⚡ Quick Setup (Step-by-Step)

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

---

### 1. Clone / Extract the project

```bash
cd skillswap
```

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/skillswap
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Optional: Email (leave blank to skip email in dev)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=SkillSwap <noreply@skillswap.com>
```

```bash
# Seed the database with demo data
npm run seed

# Start backend (development)
npm run dev
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
```

`.env` (defaults work out of box with Vite proxy):
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_UPLOADS_URL=http://localhost:5000/uploads
```

```bash
# Start frontend (development)
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### 4. Open the App

Navigate to: **http://localhost:5173**

**Demo accounts (after seeding):**
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@skillswap.com | admin123 |
| User | alice@example.com | password123 |
| User | bob@example.com | password123 |

---

## 🌟 Features

### User Features
- ✅ Register & Login (JWT auth)
- ✅ Profile creation with photo upload
- ✅ Add/remove skills offered and wanted
- ✅ Search users by skill with filters
- ✅ AI-powered skill match recommendations
- ✅ Send / Accept / Reject swap requests
- ✅ Real-time notifications via Socket.io
- ✅ Real-time chat between matched users
- ✅ Leave ratings & reviews after swap
- ✅ Dashboard with stats & quick actions

### Admin Features
- ✅ Analytics dashboard (users, swaps, ratings)
- ✅ User management (ban/unban, role change)
- ✅ Swap monitoring with status filters
- ✅ Export users to CSV

### Real-time Features
- ✅ Instant swap request notifications
- ✅ Live chat with typing indicators
- ✅ Online/offline user status tracking

---

## 🔗 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/change-password` | Change password |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get own profile |
| PUT | `/api/users/update` | Update profile |
| GET | `/api/users/:id` | Get user by ID |
| GET | `/api/users/notifications` | Get notifications |

### Search
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search` | Search users by skill |
| GET | `/api/search/recommendations` | AI recommendations |
| GET | `/api/search/popular-skills` | Popular skills list |

### Swaps
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/swaps` | Create swap request |
| GET | `/api/swaps` | Get my swaps |
| GET | `/api/swaps/:id` | Get swap by ID |
| PUT | `/api/swaps/:id` | Update swap status |

### Feedback
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/feedback` | Submit feedback |
| GET | `/api/feedback/:userId` | Get user feedback |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| PUT | `/api/admin/ban/:id` | Ban/unban user |
| GET | `/api/admin/swaps` | List all swaps |
| GET | `/api/admin/analytics` | Analytics data |
| GET | `/api/admin/export/users` | Export CSV |

---

## 🚢 Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build

# Deploy dist/ folder to Vercel
# Set env vars in Vercel dashboard:
# VITE_API_URL=https://your-backend.onrender.com/api
# VITE_SOCKET_URL=https://your-backend.onrender.com
```

### Backend → Render / Railway

1. Push backend folder to GitHub
2. Create new Web Service on Render
3. Set environment variables from `.env`
4. Set `MONGO_URI` to MongoDB Atlas connection string
5. Build command: `npm install`
6. Start command: `npm start`

### Database → MongoDB Atlas

1. Create free cluster at mongodb.com/atlas
2. Create database user
3. Whitelist IP (0.0.0.0/0 for all)
4. Copy connection string to `MONGO_URI`

---

## 🔒 Security Features

- JWT authentication on all protected routes
- bcrypt password hashing (12 rounds)
- Input validation (express-validator)
- Rate limiting (200 req/15min global, 20 for auth)
- CORS configured for frontend origin
- Helmet.js security headers
- Banned user detection on every request

---

## 🤝 Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `swap_notification` | Server → Client | New swap request / status update |
| `receive_message` | Server → Client | New chat message |
| `user_typing` | Server → Client | Typing indicator |
| `user_online` | Server → Client | Online/offline status |
| `send_message` | Client → Server | Send chat message |
| `join_room` | Client → Server | Join chat room |
| `typing` | Client → Server | Typing indicator |

---

## 📸 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Marketing homepage |
| Login | `/login` | Sign in |
| Register | `/register` | Create account |
| Dashboard | `/dashboard` | Stats + recent swaps + recommendations |
| Search | `/search` | Discover users by skill |
| Profile | `/profile` | View own profile |
| Edit Profile | `/profile/edit` | Edit info + skills + photo |
| User Profile | `/users/:id` | View other user + request swap |
| Swaps | `/swaps` | Manage swap requests |
| Chat | `/chat` | Real-time messaging |
| Admin | `/admin` | Analytics (admin only) |
| Admin Users | `/admin/users` | User management |
| Admin Swaps | `/admin/swaps` | Swap monitoring |

---

## 📝 License

MIT — Built for learning and placement showcase purposes.
