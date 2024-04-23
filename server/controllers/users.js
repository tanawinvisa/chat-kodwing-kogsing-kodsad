const ObjectId = require("mongodb").ObjectId;

// user = {id, username, rooms: {name, pin}}
// room = {room, userCount, latestMessage, private}
// message = {id, author, message, time, room}
const users = [];
const rooms = [];
const messages = [];

const addUser = (userId, username) => {
  // register user if not exist
  const index = users.findIndex((user) => user.username === username);
  if (index === -1) {
    const user = { id: userId, username: username, rooms: [] };
    users.push(user);
  } else {
    users[index].id = userId;
  }
  console.log(users);
};

const joinRoom = (userId, username, room, private) => {
  // if new room, then create room
  let roomIndex = rooms.findIndex((r) => r.room === room);
  if (private === undefined) {
    private = false;
  } else {
    private = true;
  }
  if (roomIndex === -1) {
    rooms.push({
      room: room,
      userCount: 0,
      latestMessage: "",
      private: private,
    });
  }
  roomIndex = rooms.findIndex((r) => r.room === room);

  // register user into the room and add room user count
  const index = users.findIndex((user) => user.username === username);
  if (index !== -1) {
    const userRoomIndex = users[index].rooms.findIndex((r) => r.name === room);
    if (userRoomIndex === -1) {
      users[index].rooms.push({ name: room, pin: false });
      rooms[roomIndex].userCount += 1;
    }
  } else {
    const user = {
      id: userId,
      username: username,
      rooms: [{ name: room, pin: false }],
    };
    users.push(user);
    rooms[roomIndex].userCount += 1;
  }
  console.log(rooms);
  console.log(users);
};

const leaveRoom = (username, room) => {
  // remove specific room from user room list
  const user = users.find((user) => user.username === username);
  if (user.rooms.length === 0) {
    return;
  }
  const specificRoom = user.rooms.findIndex((r) => r === room);
  if (specificRoom !== -1) {
    user.rooms.splice(specificRoom, 1);
  }
  // decrease user count
  const roomIndex = rooms.findIndex((r) => r.room === room);
  rooms[roomIndex].userCount -= 1;
  // if no user in the room, then remove room
  if (rooms[roomIndex].userCount === 0) {
    rooms.splice(roomIndex, 1);
  }
};

const getCurrentUser = (username) => {
  return users.find((user) => user.username === username);
};

const getAllUsers = () => {
  const allUsers = users.map((user) => user.username);
  return allUsers;
};

const getAllRooms = (private) => {
  const filteredRoom = rooms.filter((r) => r.private === private);
  return filteredRoom;
};

const getUserRooms = (username) => {
  const user = users.find((user) => user.username === username);
  if (user) {
    const userRooms = [];
    if (user.rooms != []) {
      user.rooms.map((userRoom) => {
        const room = rooms.find((r) => r.room === userRoom.name);
        userRooms.push({ room: room, pin: userRoom.pin });
      });
    }
    return userRooms;
  } else {
    return [];
  }
};

const pinChat = (username, room, pinStatus) => {
  const index = users.findIndex((user) => user.username === username);
  if (index !== -1) {
    const roomIndex = users[index].rooms.findIndex((r) => r.name === room);
    if (roomIndex !== -1) {
      users[index].rooms[roomIndex].pin = pinStatus;
    }
  }
  console.log(users[index].rooms);
};

const updateLatestMessage = (message) => {
  const index = rooms.findIndex((r) => r.room === message.room);
  if (index != -1) {
    rooms[index].latestMessage = message;
    return true;
  } else {
    return false;
  }
};

const sendMessage = (message) => {
  let m = null;
  if (
    message &&
    message.message !== undefined &&
    message.message.trim() !== ""
  ) {
    m = {
      id: new ObjectId().toString(),
      author: message.author,
      message: message.message,
      time: message.time,
      room: message.room,
      announce: false,
    };
    messages.push(m);
    done = updateLatestMessage(m);
  }
  console.log(messages);
  console.log(rooms);
  return m;
};

const unsendMessage = (message) => {
  if (message) {
    const index = messages.findIndex(
      (m) =>
        m.id === message.id &&
        m.message === message.message &&
        m.room === message.room
    );
    messages.splice(index, 1);
  }
};

const announceMessage = (message) => {
  if (message) {
    const index = messages.findIndex(
      (m) => m.id === message.id && m.message === message.message
    );
    if (index !== -1) {
      messages[index].announce = true;
    }
  }
};

const removeAnnounce = (room) => {
  const roomMessages = messages.filter((m) => m.room === room);
  roomMessages.map((m) => (m.announce = false));
};

const getMessageInRoom = (room) => {
  const msg = messages.filter((m) => m.room === room);
  console.log(msg);
  return msg;
};

module.exports = {
  addUser,
  joinRoom,
  leaveRoom,
  getCurrentUser,
  getAllUsers,
  getAllRooms,
  getUserRooms,
  pinChat,
  sendMessage,
  unsendMessage,
  announceMessage,
  removeAnnounce,
  getMessageInRoom,
};
