const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}); 

const photoSchema = mongoose.Schema({
    year: { type: String, required: true },
    postImageUrl: { type: String },
    postTitle: { type: String, default: "" },
    postDescription: { type: String, default: "" },
    likeUserIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    ownerIds: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: {
        type: [commentSchema],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('Photos', photoSchema);
