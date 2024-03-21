const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        index: true,
        unique: true,
        uppercase: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    dob: {
        type: String,
        trim: true,
        default: ""
    },
    password: {
        type: String,
    },
}, { timestamps: true });

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);