const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    phoneNumber: { type: String, required: true }, // Ensure this is defined
    role: { type: String, default: 'user' }, // Add if you have roles
});

module.exports = mongoose.model('User', userSchema);
