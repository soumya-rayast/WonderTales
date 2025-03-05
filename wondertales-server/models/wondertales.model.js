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
        type: String,
        required: true
    },
    isFavourites: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    createdOn: {
        type: String,
        required: true,
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