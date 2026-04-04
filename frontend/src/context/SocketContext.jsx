import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from './AuthContext'
import { getSocket } from '../services/socket'

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, addNotification } = useAuth()
  const [onlineUsers, setOnlineUsers] = useState(new Set())
  const [unreadMessages, setUnreadMessages] = useState(0)

  useEffect(() => {
    if (!isAuthenticated) return
    const socket = getSocket()
    if (!socket) return

    const handleOnline = ({ userId, isOnline }) => {
      setOnlineUsers(prev => {
        const next = new Set(prev)
        isOnline ? next.add(userId) : next.delete(userId)
        return next
      })
    }

    const handleSwapNotification = (data) => {
      addNotification({ ...data, read: false, createdAt: new Date() })
    }

    const handleNewMessage = () => {
      setUnreadMessages(prev => prev + 1)
    }

    socket.on('user_online', handleOnline)
    socket.on('swap_notification', handleSwapNotification)
    socket.on('new_message_notification', handleNewMessage)

    return () => {
      socket.off('user_online', handleOnline)
      socket.off('swap_notification', handleSwapNotification)
      socket.off('new_message_notification', handleNewMessage)
    }
  }, [isAuthenticated])

  const isUserOnline = (userId) => onlineUsers.has(userId?.toString())
  const clearUnreadMessages = () => setUnreadMessages(0)

  return (
    <SocketContext.Provider value={{ onlineUsers, isUserOnline, unreadMessages, clearUnreadMessages }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext) || {}
