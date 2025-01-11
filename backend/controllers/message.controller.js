import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { encryptString, decryptString } from "../utils/crypto.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [],
        unreadMessages: 0,
      });
    }

    const encryptedMessage = await encryptString(message, process.env.ENCRYPTION_KEY); 

    const newMessage = new Message({
      senderId,
      receiverId,
      message: encryptedMessage,
      isSent: true,
      isRead: false,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    // SOCKET IO FUNCTIONALITY WILL GO HERE
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // io.to(<socket_id>).emit() used to send events to specific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({...(newMessage._doc), message: message});
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    // Find the conversation between senderId and userToChatId
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages"); 

    if (!conversation) {
      return res.status(200).json([]); // Return an empty array if no conversation found
    }

    const messages = conversation.messages;

    const decryptedMessages = await Promise.all(messages.map(async (message) => {
      message.isRead = true;
      await message.save();
      console.log(message);
    
      const decryptedMessage = await decryptString(message.message, process.env.ENCRYPTION_KEY);
      
      return { 
        senderId:message.senderId,
        receiverId: message.receiverId,
        isRead: message.isRead,
        isSent: message.isSent,
        _id: message._id,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        message: decryptedMessage 
      };
    }));
    
    res.status(200).json(decryptedMessages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

