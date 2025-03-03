const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./db'); // Ensure db connection is exported
const router = express.Router();

router.post('/signup', async (req, res) => {
    const {
        username, role, name, gender, email, password, contact_number,
        date_of_birth, height, weight, fitness_goals, profile_picture
    } = req.body;

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `INSERT INTO users 
            (username, role, name, gender, email, password, contact_number, 
            date_of_birth, profile_picture, height, weight, fitness_goals) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            username, role, name, gender, email, hashedPassword, contact_number,
            date_of_birth, profile_picture, height, weight, fitness_goals
        ];

        db.query(sql, values, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error', details: err });
            }
            res.status(201).json({ message: 'User registered successfully!' });
        });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
