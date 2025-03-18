const express = require('express');
const db = require('../db'); 
const router = express.Router();

router.get('/display/:user_id', (req, res) => {
    const { user_id } = req.params; 
    
    const displayQuery = `SELECT * FROM member_trainer mt
                        INNER JOIN user u ON mt.member_id = u.user_id
                        WHERE mt.trainer_id = ?`;
    
    db.query(displayQuery, [user_id], (error, displayResult) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    
        res.json({ success: true, progress: displayResult});
                        
    });
});

module.exports = router;
