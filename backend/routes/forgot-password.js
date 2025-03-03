const express = require('express');
const db = require('../db');
const router = express.Router();

// Set timeout duration (5 seconds)
const TIMEOUT_DURATION = 5000; 

router.post('/forgot-password', async (req, res) => {
    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('Database query timed out'));
        }, TIMEOUT_DURATION);
    });

    try {
        const { email } = req.body;

        // Race database query against timeout
        const [rows] = await Promise.race([
            db.query('SELECT user_id FROM `user` WHERE email = ?', [email]),
            timeoutPromise
        ]);

        if (!rows || !Array.isArray(rows)) {
            throw new Error('Unexpected database response format');
        }

        if (rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Email not found' 
            });
        }

        return res.json({ 
            success: true,
            message: 'Email verified'
        });

    } catch (error) {
        console.error('Error:', error.message);
        
        // Custom response for timeout
        if (error.message.includes('timed out')) {
            return res.status(504).json({
                success: false,
                error: 'Request timeout',
                message: 'Database response took too long'
            });
        }

        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: error.message
        });
    }
});

module.exports = router;