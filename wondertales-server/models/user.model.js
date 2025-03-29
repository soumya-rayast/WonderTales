const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        unique: true,
        required: true,
    },
    createdAt: {
        type: String,
        default: Date.now
    }
})

module.exports = mongoose.model("User", userSchema);