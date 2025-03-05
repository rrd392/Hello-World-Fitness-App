const express = require('express');
const db = require('../db'); 
const router = express.Router();

router.get('/display/:user_id/:user_role', (req, res) => {
    const { user_id, user_role } = req.params;

    const notificationQuery = `
        SELECT DISTINCT n.*
        FROM notifications n
        LEFT JOIN class_participants cp ON n.class_id = cp.class_id AND cp.user_id = ?
        LEFT JOIN user_membership um ON um.user_id = ?  
        WHERE 
            (n.end_date IS NULL OR n.end_date > NOW())
            AND (
                (n.target = 'General') 
                OR (n.target = 'Member' AND ? = 'member')
                OR (n.target = 'Trainer' AND ? = 'trainer')
            )
            AND (
                (n.user_id IS NULL AND n.class_id IS NULL) 
                OR (n.user_id = ?) 
                OR (n.class_id IS NOT NULL AND cp.user_id IS NOT NULL) 
            )
            AND (
                n.notification_id != 2  
                OR (n.notification_id = 2 AND um.end_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 7 DAY))
            )`;

    db.query(notificationQuery, [user_id, user_id, user_role, user_role, user_id], (error, results) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }

        res.json({ success: true, notifications: results });
    });
});

module.exports = router;
