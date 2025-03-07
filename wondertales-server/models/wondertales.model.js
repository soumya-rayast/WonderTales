const mongoose = require('mongoose');

const wondertalesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    story: {
        type: String,
        required: true
    },
    visitedLocation: {
        type: [String],
        required: true
    },
    isFavourites: {
        type: Boolean,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
    },
    createdOn: {
        type: String,
        required: Date.now(),
    },
    imageUrl: {
        type: String,
        required: true,
    },
    visitedDate: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("WonderTales", wondertalesSchema);