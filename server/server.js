const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const Server = require("socket.io");
const {
  joinRoom,
  getAllUsers,
  leaveRoom,
  addUser,
  getAllRooms,
  sendMessage,
  getMessageInRoom,
  getUserRooms,
  unsendMessage,
  announceMessage,
  removeAnnounce,
  pinChat,
} = require("./controllers/users");

dotenv.config();

const app = express();
app.use(cors);
const server = http.createServer(app);
const io = Server(server);

io.on("connection", (socket) => {
  socket.emit("userId", socket.id);
  socket.on("register", ({ username }) => {
    addUser(socket.id, username);
    socket.emit("userId", socket.id);
    // console.log(socket.id);
  });

  socket.on("join-room", ({ username, room, private }) => {
    // console.log(room);
    joinRoom(socket.id, username, room, private);
    socket.join(room);
  });

  socket.on("send-message", (message) => {
    // console.log(message.room);
    const m = sendMessage(message);
    if (m) {
      io.to(message.room).emit("message", m);
    }
  });

  socket.on("unsend-message", (message) => {
    unsendMessage(message);
    io.to(message.room).emit("remove-message", message);
  });

  socket.on("announce-message", (message) => {
    announceMessage(message);
    io.to(message.room).emit("new-announce", message);
  });

  socket.on("remove-announce", ({ room }) => {
    removeAnnounce(room);
    io.to(room).emit("announce-removed", room);
  });

  socket.on("get-past-messages", ({ room }) => {
    // console.log(room);
    const past_messages = getMessageInRoom(room);
    io.to(room).emit("past-messages", { room: room, messages: past_messages });
  });

  socket.on("get-all-users", () => {
    const users = getAllUsers();
    io.emit("users", users);
  });

  socket.on("get-all-rooms", (private) => {
    const getPrivate = !(private === undefined);
    const rooms = getAllRooms(getPrivate);
    io.emit("rooms", rooms);
  });

  socket.on("get-user-rooms", ({ username }) => {
    const rooms = getUserRooms(username);
    io.to(socket.id).emit("user-rooms", rooms);
  });

  socket.on("pin-chat", ({ username, room, pinStatus }) => {
    pinChat(username, room, pinStatus);
  });

  socket.on("leave-room", ({ username, room }) => {
    leaveRoom(username, room);
    socket.leave(room);
  });
});

server.listen(5000, () => {
  console.log(`Server start on port ${5000}`);
});
