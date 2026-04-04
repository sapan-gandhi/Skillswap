import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
}

// ─── Users ───────────────────────────────────────────────────────────────────
export const userService = {
  getProfile: () => api.get('/users/profile'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/update', data),
  getNotifications: () => api.get('/users/notifications'),
  markNotificationsRead: () => api.put('/users/notifications/read'),
  getSkillSuggestions: () => api.get('/users/skill-suggestions'),
  uploadPhoto: (formData) => api.post('/upload/profile-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}

// ─── Search ──────────────────────────────────────────────────────────────────
export const searchService = {
  search: (params) => api.get('/search', { params }),
  getRecommendations: () => api.get('/search/recommendations'),
  getPopularSkills: () => api.get('/search/popular-skills'),
}

// ─── Swaps ───────────────────────────────────────────────────────────────────
export const swapService = {
  createSwap: (data) => api.post('/swaps', data),
  getSwaps: (params) => api.get('/swaps', { params }),
  getSwapById: (id) => api.get(`/swaps/${id}`),
  updateSwap: (id, data) => api.put(`/swaps/${id}`, data),
}

// ─── Feedback ────────────────────────────────────────────────────────────────
export const feedbackService = {
  createFeedback: (data) => api.post('/feedback', data),
  getUserFeedback: (userId, params) => api.get(`/feedback/${userId}`, { params }),
}

// ─── Chat ────────────────────────────────────────────────────────────────────
export const chatService = {
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (roomId, params) => api.get(`/chat/messages/${roomId}`, { params }),
}

// ─── Admin ───────────────────────────────────────────────────────────────────
export const adminService = {
  getUsers: (params) => api.get('/admin/users', { params }),
  banUser: (id, data) => api.put(`/admin/ban/${id}`, data),
  updateUserRole: (id, data) => api.put(`/admin/users/${id}/role`, data),
  getSwaps: (params) => api.get('/admin/swaps', { params }),
  getAnalytics: () => api.get('/admin/analytics'),
  exportUsers: () => api.get('/admin/export/users', { responseType: 'blob' }),
}
