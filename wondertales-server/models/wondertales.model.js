const mongoose = require('mongoose');

const wondertalesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim:true,
    },
    story: {
        type: String,
        required: true,
        trim:true,
    },
    visitedLocation: {
        type: [String],
        required: true
    },
    isFavourites: {
        type: Boolean,
        required: true,
        default:false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
        index:true,
    },
    createdOn: {
        type: String,
        required: Date.now,
    },
    imageUrl: {
        type: String,
        required: true,
        trim:true,
    },
    visitedDate: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("WonderTales", wondertalesSchema);