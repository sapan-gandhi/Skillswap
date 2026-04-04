/**
 * Socket.io Handler
 * Real-time: chat, notifications, online tracking
 */

const { verifyToken } = require('../utils/jwt.utils');
const User = require('../models/User.model');
const Message = require('../models/Message.model');

// Online users map: userId -> socketId
const onlineUsers = new Map();

const initSocket = (io) => {
  // Auth middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      if (!token) return next(new Error('Authentication required'));

      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select('_id name profilePhoto role');
      if (!user) return next(new Error('User not found'));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.user._id.toString();
    console.log(`🔌 Socket connected: ${socket.user.name} (${userId})`);

    // Track online status
    onlineUsers.set(userId, socket.id);
    await User.findByIdAndUpdate(userId, { isOnline: true, socketId: socket.id, lastActive: new Date() });

    // Join personal room for direct notifications
    socket.join(userId);

    // Broadcast online status to all
    io.emit('user_online', { userId, isOnline: true });

    // ─── Chat ────────────────────────────────────────────────────────────────

    // Join a chat room
    socket.on('join_room', ({ roomId }) => {
      socket.join(roomId);
      console.log(`💬 ${socket.user.name} joined room ${roomId}`);
    });

    // Leave a chat room
    socket.on('leave_room', ({ roomId }) => {
      socket.leave(roomId);
    });

    // Send message
    socket.on('send_message', async ({ roomId, receiverId, content }) => {
      try {
        if (!content?.trim()) return;

        const message = await Message.create({
          chatRoomId: roomId,
          sender: socket.user._id,
          receiver: receiverId,
          content: content.trim(),
        });

        await message.populate('sender', 'name profilePhoto');

        // Emit to room (both sender and receiver)
        io.to(roomId).emit('receive_message', message);

        // Notify receiver if not in room
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverId).emit('new_message_notification', {
            roomId,
            sender: { _id: socket.user._id, name: socket.user.name },
            preview: content.slice(0, 50),
          });
        }
      } catch (err) {
        console.error('Send message error:', err);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing', ({ roomId, isTyping }) => {
      socket.to(roomId).emit('user_typing', { userId, name: socket.user.name, isTyping });
    });

    // Mark messages as read
    socket.on('mark_read', async ({ roomId }) => {
      await Message.updateMany(
        { chatRoomId: roomId, receiver: socket.user._id, isRead: false },
        { isRead: true, readAt: new Date() }
      );
      socket.to(roomId).emit('messages_read', { roomId, userId });
    });

    // ─── Disconnect ──────────────────────────────────────────────────────────
    socket.on('disconnect', async () => {
      console.log(`🔌 Socket disconnected: ${socket.user.name}`);
      onlineUsers.delete(userId);
      await User.findByIdAndUpdate(userId, { isOnline: false, socketId: null, lastActive: new Date() });
      io.emit('user_online', { userId, isOnline: false });
    });
  });

  return io;
};

module.exports = { initSocket, onlineUsers };
