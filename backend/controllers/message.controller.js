import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

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
        messages: [], // Ensure the field is initialized as an empty array
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    await newMessage.save();

    conversation.messages.push(newMessage._id);
    await conversation.save();

    // Optionally, you can emit the new message using Socket.io here

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]); // Return an empty array if conversation not found
    }

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
