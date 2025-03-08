const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/reset-password', (req, res) => {
  const { email, newPassword } = req.body;

  // 1. Update password
  db.query(
    'UPDATE user SET password = ? WHERE email = ?',
    [newPassword, email],
    (error, results) => {
      if (error) {
        console.error('Update error:', error);
        return res.status(500).json({ 
          success: false,
          error: 'Password update failed' 
        });
      }

      // 2. Check if any rows were affected
      if (results.affectedRows === 0) {
        return res.status(400).json({
          success: false,
          error: 'No user found with this email'
        });
      }

      // 3. Success response
      res.json({
        success: true,
        message: 'Password updated successfully'
      });
    }
  );
});

module.exports = router;