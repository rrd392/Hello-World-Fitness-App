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
            return res.json({ success: false, message: "Username does not exist!" });
        }

        const user = results[0];


        if (password !== user.password) {
            return res.json({ success: false, message: "Invalid password!" });
        }

        const SECRET_KEY = "your_secret_key";  
        const token = jwt.sign({ id: user.user_id, role: user.role, name: user.name }, SECRET_KEY, { expiresIn: "1h" });

        res.json({
            success: true,
            role: user.role,
            token,
            user: {
                id: user.user_id,
                username: user.username
            }
        });
    });
});

module.exports = router;
