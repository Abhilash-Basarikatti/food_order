const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
    try {
        console.log('Registration request received:', {
            ...req.body,
            password: '[HIDDEN]'
        });

        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            console.log('Missing required fields');
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        user = new User({
            name,
            email,
            password
        });

        // Password will be hashed by the pre-save middleware in User model
        await user.save();
        console.log('User created successfully:', user._id);

        // Generate token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'default_jwt_secret_key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        console.log('Login attempt for:', req.body.email);
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid password for user:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'default_jwt_secret_key',
            { expiresIn: '24h' }
        );

        console.log('Login successful for user:', user._id);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                address: user.address
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

// Update user address
router.post('/update-address', auth, async (req, res) => {
    try {
        const { street, city, state, zipCode } = req.body;

        // Validate address fields
        if (!street || !city || !state || !zipCode) {
            return res.status(400).json({ 
                message: 'Please provide all address fields: street, city, state, and zipCode' 
            });
        }

        // Update user's address
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            {
                address: { street, city, state, zipCode }
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Address updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                address: user.address
            }
        });
    } catch (error) {
        console.error('Update address error:', error);
        res.status(500).json({ message: 'Failed to update address' });
    }
});

// Get user profile with address
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                address: user.address
            }
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
});

// Verify token
router.get('/verify', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret_key');
        
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                address: user.address
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = router; 