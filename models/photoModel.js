const mongoose = require('mongoose');


const postSchema = mongoose.Schema({
    postImageUrl: {
        type: String,
    },
    postTitle: {
        type: String,
        default:""
    },
    postDescription: {
        type: String,
        default:""
    },
    likeUserIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    ownerIds: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //Will use later
    // comments: [{
    //     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //     text: String,
    //     createdAt: { type: Date, default: Date.now }
    // }],
}, { timestamps: true });

module.exports = mongoose.model('Photos', postSchema);