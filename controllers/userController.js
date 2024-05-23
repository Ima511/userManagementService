const User = require('../models/user');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res) => {
    const { email, username, password, role } = req.body;

    if (!email || !username || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ email, username, password, role });

    if (user) {
        res.status(201).json({
            _id: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.username;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            email: updatedUser.email,
            username: updatedUser.username,
            role: updatedUser.role,
            token: generateToken(updatedUser._id, updatedUser.role),
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { registerUser, authUser, getUserProfile, updateUserProfile };
