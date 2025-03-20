const express = require('express');
const db = require('../db'); 
const router = express.Router();

router.get('/displayClassData/:scheduleDate', (req, res) => {
    const {scheduleDate} = req.params;

    const classDataQuery = `SELECT c.*, u.*, COUNT(cp.class_id) AS participants FROM classes c
                            INNER JOIN user u ON c.trainer_id = u.user_id
                            LEFT JOIN class_participants cp ON c.class_id = cp.class_id
                            WHERE schedule_date = ?
                            GROUP BY c.class_id`;
    
    db.query(classDataQuery, [scheduleDate], (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({results});
    });
});

router.get('/displayFeedback/:class_id', (req, res) => {
    const {class_id} = req.params;

    const feedbackQuery = `SELECT * FROM feedback f
                            INNER JOIN user u ON f.member_id = u.user_id
                            WHERE class_id = ?`;
    
    db.query(feedbackQuery, [class_id], (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({results});
    });
});

router.post('/addUserClass', (req, res) => {
    const {class_id, user_id} = req.body;

    const checkQuery = 'SELECT * FROM class_participants WHERE class_id = ? AND user_id = ?';
    db.query(checkQuery, [class_id, user_id], (error, checkResults)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }

        if (checkResults.length > 0){
            return res.status(400).json({ success:false, message: "You have already signed up for this class." });
        }

        const checkDateQuery = 'SELECT * FROM classes WHERE class_id = ?';

        db.query(checkDateQuery, [class_id], (error, dateResults)=>{
            if (error) {
                return res.status(500).json({ error: "Database query failed" });
            }
            const currentDate = new Date();
            const hours = currentDate.getHours().toString().padStart(2, '0');
            const minutes = currentDate.getMinutes().toString().padStart(2, '0');
            const seconds = currentDate.getSeconds().toString().padStart(2, '0');

            const currentTime = `${hours}:${minutes}:${seconds}`;
            const scheduleDateObj = new Date(dateResults[0].schedule_date); 
            const localScheduleDate = new Date(scheduleDateObj.getTime() - scheduleDateObj.getTimezoneOffset() * 60000); 
            const scheduleDateString = localScheduleDate.toISOString().split('T')[0]; 
            const localCurrentDate = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000); 
            const currentDateString = localCurrentDate.toISOString().split('T')[0];

            if(scheduleDateString > currentDateString || (scheduleDateString == currentDateString && dateResults[0].start_time > currentTime)){
                const addUserClassQuery = `INSERT INTO class_participants (class_id, user_id)
                                        VALUES (?, ?)`;
            
                db.query(addUserClassQuery, [class_id, user_id], (error, results)=>{
                    if (error) {
                        return res.status(500).json({ error: "Database query failed" });
                    }
                    res.json({success:true});
                });
            }else{
                return res.status(400).json({ success:false, message: "Failed to attend. Class is over." });
            }
        });
    });
});

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
                        WHERE cp.user_id = ? AND (c.schedule_date > ? OR ( c.schedule_date = ? AND c.start_time > ?))
                        ORDER BY c.schedule_date`;
    
    db.query(classesQuery, [user_id, currentDateString, currentDateString, currentTime], (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({results});
    });
});

router.post('/cancelClass', (req, res) => {
    const {user_id, class_id} = req.body;

        const cancelUserClassQuery = `DELETE FROM class_participants WHERE class_id = ? AND user_id = ?`;
    
    db.query(cancelUserClassQuery, [class_id, user_id], (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({success:true});
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

    const classesQuery = `SELECT c.*, u.*, 
                            (SELECT COUNT(cp2.class_id) 
                                FROM class_participants cp2 
                                WHERE cp2.class_id = c.class_id) AS participants, 
                            CASE 
                                WHEN fc.class_id IS NOT NULL THEN TRUE 
                                ELSE FALSE 
                            END AS rated
                        FROM class_participants cp
                        INNER JOIN classes c ON cp.class_id = c.class_id
                        INNER JOIN user u ON c.trainer_id = u.user_id
                        LEFT JOIN feedback fc ON cp.class_id = fc.class_id AND cp.user_id = fc.member_id
                        WHERE cp.user_id = ? 
                            AND (c.schedule_date < ? OR (c.schedule_date = ? AND c.start_time < ?))
                        ORDER BY c.schedule_date`;
    
    db.query(classesQuery, [user_id, currentDateString, currentDateString, currentTime], (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({results});
    });
});

router.post('/rateClass', (req, res) => {
    const { user_id, trainer_id, class_id, coach_rating, class_rating, review } = req.body;

    const rateClassQuery = `INSERT INTO feedback (member_id, trainer_id, class_id, feedback_date, trainer_rating, class_rating, comments)
                            VALUES (?, ?, ?, NOW(), ?, ?, ?)`;
    
    db.query(rateClassQuery, [user_id, trainer_id, class_id, coach_rating, class_rating, review], (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({success:true});
    });
});

module.exports = router;