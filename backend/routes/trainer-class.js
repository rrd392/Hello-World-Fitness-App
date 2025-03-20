const express = require('express');
const db = require('../db'); 
const router = express.Router();

router.get('/displayUpcomingClasses/:user_id', (req, res) => {
    const {user_id} = req.params;
    const currentDate = new Date();
    const localCurrentDate = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000); 
    const currentDateString = localCurrentDate.toISOString().split('T')[0];
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    const currentTime = `${hours}:${minutes}:${seconds}`;

    const classesQuery = `SELECT c.*, u.*, 
                        (SELECT COUNT(cp2.class_id) 
                            FROM class_participants cp2 
                            WHERE cp2.class_id = c.class_id) AS participants
                        FROM class_participants cp
                        INNER JOIN classes c ON cp.class_id = c.class_id
                        INNER JOIN user u ON c.trainer_id = u.user_id
                        WHERE c.trainer_id = ? AND (c.schedule_date > ? OR ( c.schedule_date = ? AND c.start_time > ?))
                        ORDER BY c.schedule_date`;
    
    db.query(classesQuery, [user_id, currentDateString, currentDateString, currentTime], (error, results)=>{
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
                            WHERE cp2.class_id = c.class_id) AS participants,
                            fc.* 
                        FROM classes c
                        INNER JOIN user u ON c.trainer_id = u.user_id
                        LEFT JOIN class_participants cp ON c.class_id = cp.class_id  
                        LEFT JOIN feedback fc ON c.class_id = fc.class_id AND c.trainer_id = fc.trainer_id
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
