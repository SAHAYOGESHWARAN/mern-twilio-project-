const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    otp: { type: String },
    isVerified: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
