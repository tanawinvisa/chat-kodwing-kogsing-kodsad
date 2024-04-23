// users.js
const express = require('express');
const router = express.Router();
const {
  addUser,
  joinRoom,
  leaveRoom,
  getAllUsers,
  getUserRooms,
  pinChat
} = require('../controllers/users');

// Assuming that addUser, joinRoom, etc., are already defined in your controller
// You might need to adjust based on actual implementations or add middleware

router.post('/addUser', addUser);
router.post('/joinRoom', joinRoom);
router.post('/leaveRoom', leaveRoom);
router.get('/allUsers', getAllUsers);
router.get('/userRooms/:username', getUserRooms);
router.post('/pinChat', pinChat);

module.exports = router;