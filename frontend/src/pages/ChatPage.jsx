import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import { chatService } from '../services/api'
import { getSocket } from '../services/socket'
import { format, isToday, isYesterday } from 'date-fns'

const formatMsgTime = (date) => {
  const d = new Date(date)
  if (isToday(d)) return format(d, 'HH:mm')
  if (isYesterday(d)) return `Yesterday ${format(d, 'HH:mm')}`
  return format(d, 'MMM d, HH:mm')
}

export default function ChatPage() {
  const { roomId: paramRoomId } = useParams()
  const { user } = useAuth()
  const { clearUnreadMessages } = useSocket()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [activeRoom, setActiveRoom] = useState(null)
  const [activePartner, setActivePartner] = useState(null)
  const [input, setInput] = useState('')
  const [typingUser, setTypingUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const activeRoomRef = useRef(null)
  const activePartnerRef = useRef(null)

  useEffect(() => { activeRoomRef.current = activeRoom }, [activeRoom])
  useEffect(() => { activePartnerRef.current = activePartner }, [activePartner])

  const scrollToBottom = () => setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)

  const loadMessages = async (roomId) => {
    try {
      const { data } = await chatService.getMessages(roomId)
      setMessages(data.messages || [])
      scrollToBottom()
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await chatService.getConversations()
        const convs = data.conversations || []
        setConversations(convs)
        if (paramRoomId) {
          const conv = convs.find(c => c.chatRoomId === paramRoomId)
          setActiveRoom(paramRoomId)
          activeRoomRef.current = paramRoomId
          if (conv) {
            setActivePartner(conv.partner)
            activePartnerRef.current = conv.partner
          }
          loadMessages(paramRoomId)
        }
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    load()
    clearUnreadMessages()
  }, [])

  useEffect(() => {
    const socket = getSocket()
    if (!socket || !activeRoom) return
    socket.emit('join_room', { roomId: activeRoom })
    const handleMessage = (msg) => {
      setMessages(prev => [...prev, msg])
      scrollToBottom()
    }
    const handleTyping = ({ name, isTyping }) => setTypingUser(isTyping ? name : null)
    socket.on('receive_message', handleMessage)
    socket.on('user_typing', handleTyping)
    return () => {
      socket.emit('leave_room', { roomId: activeRoom })
      socket.off('receive_message', handleMessage)
      socket.off('user_typing', handleTyping)
    }
  }, [activeRoom])

  const sendMessage = (e) => {
    if (e) e.preventDefault()
    const currentInput = input.trim()
    const currentRoom = activeRoomRef.current
    const currentPartner = activePartnerRef.current
    if (!currentInput || !currentRoom) return
    const socket = getSocket()
    if (!socket) return
    let receiverId = currentPartner?._id
    if (!receiverId) {
      const parts = currentRoom.replace('chat_', '').split('_')
      receiverId = parts.find(id => id !== user?._id?.toString())
    }
    if (!receiverId) return
    socket.emit('send_message', { roomId: currentRoom, receiverId, content: currentInput })
    setInput('')
  }

  const handleTypingInput = (val) => {
    setInput(val)
    const socket = getSocket()
    if (!socket || !activeRoom) return
    socket.emit('typing', { roomId: activeRoom, isTyping: true })
    clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => socket.emit('typing', { roomId: activeRoom, isTyping: false }), 1500)
  }

  const selectConversation = (conv) => {
    setActiveRoom(conv.chatRoomId)
    setActivePartner(conv.partner)
    activeRoomRef.current = conv.chatRoomId
    activePartnerRef.current = conv.partner
    loadMessages(conv.chatRoomId)
    navigate(`/chat/${conv.chatRoomId}`, { replace: true })
    setConversations(prev => prev.map(c => c.chatRoomId === conv.chatRoomId ? { ...c, unreadCount: 0 } : c))
  }

  const UPLOADS = import.meta.env.VITE_UPLOADS_URL || '/uploads'

  return (
    <div className="h-[calc(100vh-120px)] lg:h-[calc(100vh-48px)] flex rounded-2xl overflow-hidden border border-slate-700/50 bg-surface-100/30">
      {/* Sidebar */}
      <div className={`w-full lg:w-72 border-r border-slate-700/50 flex flex-col ${activeRoom ? 'hidden lg:flex' : 'flex'}`}>
        <div className="px-4 py-4 border-b border-slate-700/50">
          <h2 className="font-display font-bold text-white">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-14 bg-surface-200 rounded-xl animate-pulse m-2" />)
          ) : conversations.length === 0 ? (
            <div className="text-center py-12 text-slate-500 px-4">
              <p className="text-4xl mb-3">💬</p>
              <p className="text-sm">No conversations yet.</p>
              <Link to="/swaps" className="text-primary-400 text-sm hover:underline mt-1 inline-block">Accept a swap to start chatting</Link>
            </div>
          ) : conversations.map(conv => (
            <button key={conv.chatRoomId} onClick={() => selectConversation(conv)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${conv.chatRoomId === activeRoom ? 'bg-primary-500/15 border border-primary-500/20' : 'hover:bg-surface-200/50'}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                {conv.partner?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-white truncate">{conv.partner?.name}</p>
                <p className="text-xs text-slate-500 truncate">{conv.lastMessage?.content || 'No messages yet'}</p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="bg-primary-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1">{conv.unreadCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className={`flex-1 flex flex-col ${!activeRoom ? 'hidden lg:flex' : 'flex'}`}>
        {!activeRoom ? (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            <div className="text-center">
              <p className="text-6xl mb-4">💬</p>
              <p className="font-medium text-white mb-1">Select a conversation</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700/50 bg-surface-100/50">
              <button onClick={() => { setActiveRoom(null); navigate('/chat', { replace: true }) }} className="lg:hidden text-slate-400 hover:text-white text-xl mr-1">←</button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white font-semibold text-sm">
                {activePartner?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">{activePartner?.name || 'Chat'}</p>
                <p className="text-xs text-slate-500">{typingUser ? <span className="text-primary-400 animate-pulse">typing...</span> : 'Active'}</p>
              </div>
              {activePartner && <Link to={`/users/${activePartner._id}`} className="text-slate-400 hover:text-white text-sm">View Profile →</Link>}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <p className="text-sm">No messages yet. Say hello! 👋</p>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => {
                    const senderId = msg.sender?._id?.toString() || msg.sender?.toString()
                    const isOwn = senderId === user?._id?.toString()
                    return (
                      <div key={msg._id || i} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}>
                        <div className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-sm ${isOwn ? 'bg-primary-500 text-white rounded-br-md' : 'bg-surface-200 text-slate-200 rounded-bl-md'}`}>
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${isOwn ? 'text-primary-200' : 'text-slate-500'}`}>{formatMsgTime(msg.createdAt)}</p>
                        </div>
                      </div>
                    )
                  })}
                  {typingUser && (
                    <div className="flex justify-start mb-2">
                      <div className="bg-surface-200 px-4 py-2.5 rounded-2xl rounded-bl-md flex gap-1">
                        {[0,150,300].map(d => <span key={d} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-3 px-4 py-3 border-t border-slate-700/50">
              <input
                className="input flex-1"
                placeholder="Type a message..."
                value={input}
                onChange={e => handleTypingInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(e)}
              />
              <button onClick={sendMessage} disabled={!input.trim()} className="btn-primary px-5 disabled:opacity-40">↑</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}