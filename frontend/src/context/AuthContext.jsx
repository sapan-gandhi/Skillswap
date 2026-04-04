import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/api'
import { initSocket, disconnectSocket } from '../services/socket'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])

  // Verify token on mount
  useEffect(() => {
    const verify = async () => {
      if (!token) { setLoading(false); return }
      try {
        const { data } = await authService.getMe()
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
        initSocket(token)
      } catch {
        logout()
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, [])

  const login = useCallback((userData, tokenValue) => {
    setUser(userData)
    setToken(tokenValue)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', tokenValue)
    initSocket(tokenValue)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    setNotifications([])
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    disconnectSocket()
  }, [])

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }, [])

  const addNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 50))
  }, [])

  const unreadNotifications = notifications.filter(n => !n.read).length

  return (
    <AuthContext.Provider value={{
      user, token, loading, notifications, unreadNotifications,
      login, logout, updateUser, addNotification,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
