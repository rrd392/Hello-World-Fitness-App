const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db'); 
const router = express.Router();


router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password cannot be empty" });
    }

    const query = 'SELECT * FROM user WHERE username = ?';
    
    db.query(query, [username], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: "123Invalid username or password" });
        }

        const user = results[0];


        if (password !== user.password) {
            return res.status(401).json({ success: false, message: "456Invalid username or password" });
        }


        const SECRET_KEY = "your_secret_key";  // Replace with a secure key or use .env
        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

        res.json({
            success: true,
            role: user.role,
            token,
            user: {
                id: user.id,
                username: user.username
            }
        });
    });
});

module.exports = router;
