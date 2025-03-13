const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.getAllUsers = (req, res) => {
    User.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.createUser = async (req, res) => {
    try {
        const { full_name, email, phone_number, password, role } = req.body;
        
        // Check if user already exists
        User.getByEmail(email, async (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.length > 0) return res.status(400).json({ message: 'Email already in use' });

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user
            const newUser = { full_name, email, phone_number, password_hash: hashedPassword, role };
            User.create(newUser, (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ message: 'User registered successfully' });
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    User.getByEmail(email, async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(400).json({ message: 'Invalid email or password' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ message: 'Login successful', token });
    });
};
