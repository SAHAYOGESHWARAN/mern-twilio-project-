const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Twilio client with Account SID and Auth Token
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Register user
const register = async (req, res) => {
    const { email, password, phoneNumber } = req.body; // Ensure phoneNumber is included in the request
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, phoneNumber }); // Include phoneNumber in User model
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
};

// Login user
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (!user.isVerified) return res.status(403).json({ message: 'User not verified' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};

// Send OTP
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        await user.save();

        await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER, // Make sure this is correct
            to: user.phoneNumber, // Make sure this is the user's phone number
        });

        res.json({ message: 'OTP sent' });
    } catch (error) {
        console.error(`Error sending OTP: ${error.message}`);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
};

// Verify OTP
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    user.isVerified = true;
    user.otp = null; // Clear OTP after verification
    await user.save();
    res.json({ message: 'User verified successfully' });
};

// Export the functions
module.exports = { register, login, sendOTP, verifyOTP };
