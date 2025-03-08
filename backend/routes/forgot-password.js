const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  db.query(
    'SELECT user_id FROM user WHERE email = ?',
    [email],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Email not found'
        });
      }

      res.json({
        success: true,
        message: 'Password reset authorized',
        email: email // Make sure this matches frontend access
      });
    }
  );
});

module.exports = router;