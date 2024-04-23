const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    room: {
        type: String,
        required: true,
        unique: true
    },
    userCount: {
        type: Number,
        default: 0
    },
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    private: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Room', roomSchema);