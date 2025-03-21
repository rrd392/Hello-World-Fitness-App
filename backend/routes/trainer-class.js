const express = require('express');
const db = require('../db'); 
const router = express.Router();

router.get('/displayClasses/:user_id/:schedule_date', (req, res) => {
    const {user_id, schedule_date} = req.params;

    const classesQuery = `SELECT c.*, u.*, 
                        (SELECT COUNT(cp2.class_id) 
                            FROM class_participants cp2 
                            WHERE cp2.class_id = c.class_id) AS participants
                        FROM classes c
                        INNER JOIN user u ON c.trainer_id = u.user_id
                        WHERE c.trainer_id = ? AND c.schedule_date = ?
                        ORDER BY c.schedule_date`;
    
    db.query(classesQuery, [user_id, schedule_date], (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({results});
    });
});

router.get('/displayClassParticipants/:class_id', (req, res) => {
    const {class_id } = req.params;

    const displayQuery = `SELECT u.*
                        FROM class_participants cp
                        INNER JOIN user u ON cp.user_id = u.user_id
                        WHERE cp.class_id = ?`;
    
    db.query(displayQuery, [class_id], (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({results});
    });
});

router.get('/displayMemberFeedback/:class_id', (req, res) => {
    const {class_id} = req.params;

    const displayQuery = `SELECT f.*, u.*, ut.name AS trainerName, c.class_name
                        FROM feedback f
                        INNER JOIN user u ON f.member_id = u.user_id 
                        INNER JOIN classes c ON f.class_id = c.class_id
                        INNER JOIN user ut ON f.trainer_id = ut.user_id
                        WHERE f.class_id = ?`;
    
    db.query(displayQuery, [class_id], (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({results});
    });
});

router.get('/displayClassHistory/:user_id', (req, res) => {
    const {user_id} = req.params;
    const currentDate = new Date();
    const localCurrentDate = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000); 
    const currentDateString = localCurrentDate.toISOString().split('T')[0];
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    const currentTime = `${hours}:${minutes}:${seconds}`;

    const classesQuery = `SELECT 
                            c.*, 
                            u.*, 
                            (SELECT COUNT(cp2.class_id) 
                            FROM class_participants cp2 
                            WHERE cp2.class_id = c.class_id) AS participants
                        FROM classes c
                        INNER JOIN user u ON c.trainer_id = u.user_id
                        WHERE 
                            c.trainer_id = ? 
                            AND (
                                c.schedule_date < ?
                                OR (c.schedule_date = ? AND c.start_time < ?)
                            )
                        ORDER BY c.schedule_date`;
    
    db.query(classesQuery, [user_id, currentDateString, currentDateString, currentTime], (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({results});
    });
});

module.exports = router;
