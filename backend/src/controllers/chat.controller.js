/**
 * Chat Controller
 * Message history and chat rooms
 */

const Message = require('../models/Message.model');
const User = require('../models/User.model');

/**
 * GET /api/chat/messages/:roomId
 */
const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user._id.toString();

    // Verify user is part of this chat room
    const roomParts = roomId.replace('chat_', '').split('_');
    if (!roomParts.includes(userId)) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this chat.' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const messages = await Message.find({ chatRoomId: roomId })
      .populate('sender', 'name profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Mark as read
    await Message.updateMany(
      { chatRoomId: roomId, receiver: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({ success: true, messages: messages.reverse() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * GET /api/chat/conversations
 */
const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get unique chat partners
    const sentMessages = await Message.find({ sender: userId }).distinct('receiver');
    const receivedMessages = await Message.find({ receiver: userId }).distinct('sender');

    const partnerIds = [...new Set([...sentMessages.map(String), ...receivedMessages.map(String)])];

    const partners = await User.find({ _id: { $in: partnerIds } })
      .select('name profilePhoto isOnline lastActive');

    // Get last message and unread count for each conversation
    const conversations = await Promise.all(
      partners.map(async (partner) => {
        const ids = [userId.toString(), partner._id.toString()].sort();
        const chatRoomId = `chat_${ids[0]}_${ids[1]}`;

        const [lastMessage, unreadCount] = await Promise.all([
          Message.findOne({ chatRoomId }).sort({ createdAt: -1 }).select('content createdAt sender'),
          Message.countDocuments({ chatRoomId, receiver: userId, isRead: false }),
        ]);

        return { partner, chatRoomId, lastMessage, unreadCount };
      })
    );

    // Sort by last message time
    conversations.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt || 0;
      const bTime = b.lastMessage?.createdAt || 0;
      return new Date(bTime) - new Date(aTime);
    });

    res.json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getMessages, getConversations };
