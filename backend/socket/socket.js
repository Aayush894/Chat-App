import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from 'cors'; 

const app = express();
app.use(cors({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
}
));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },

});

const userSocketMap = {}; // {userId: socketId}

export const getReceiverSocketId = (receiverId) => {
  // console.log(`receiverId is ${receiverId} userSocketMap is ${userSocketMap}`);
  return userSocketMap[receiverId];
};


io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId != "undefined") userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // socket.on() is used to listen to the events. can be used both on client and server side
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };