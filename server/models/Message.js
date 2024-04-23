const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    announce: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Message', messageSchema);