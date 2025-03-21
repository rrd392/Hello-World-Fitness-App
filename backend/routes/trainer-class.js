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

router.get('/displayPastParticipants/:class_id', (req, res) => {
    const {class_id } = req.params;

    const displayQuery = `SELECT u.*, ac.status
                        FROM class_participants cp
                        INNER JOIN user u ON cp.user_id = u.user_id
                        INNER JOIN attendance_classes ac ON cp.class_id = ac.class_id
                        WHERE cp.class_id = ?`;
    
    db.query(displayQuery, [class_id], (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({results});
    });
});

router.get('/displayAttendanceCode/:class_id', (req, res) => {
    const {class_id } = req.params;
    let code;
    const displayQuery = `SELECT code
                        FROM attendance_code 
                        WHERE available_from <= NOW() AND available_until >= NOW() AND class_id = ?`;
    
    db.query(displayQuery, [class_id], (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        if(results.length == 0){
            code = "";
        }else{
            code = results[0].code;
        }
        res.json({results: code});
    });
});

router.post('/generateAttendanceCode', (req, res) => {
    const { class_id } = req.body;

    if (!class_id) {
        return res.status(400).json({ error: "class_id is required" });
    }

    function generateRandomCode() {
        return String(Math.floor(Math.random() * 1000)).padStart(3, '0'); 
    }    

    function insertAttendanceCode() {
        const code = generateRandomCode();

        const checkQuery = `SELECT * FROM attendance_code WHERE code = ? AND available_from < NOW() AND available_until > NOW()`;
        const insertQuery = `INSERT INTO attendance_code (code, available_from, available_until, class_id)
                             VALUES (?, NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR), ?)`;

        db.query(checkQuery, [code], (error, result) => {
            if (error) {
                return res.status(500).json({ error: "Database query failed" });
            }
            if (result.length > 0) {
                insertAttendanceCode();
            } else {
                // If the code is unique, insert it
                db.query(insertQuery, [code, class_id], (error, results) => {
                    if (error) {
                        return res.status(500).json({ error: "Database query failed" });
                    }
                    res.json({ success:true });
                });
            }
        });
    }

    insertAttendanceCode();
});

router.get('/displayAttendanceHistory/:user_id', (req, res) => {
    const { user_id } = req.params;

    const currentDate = new Date();
    const localCurrentDate = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000);
    const currentDateString = localCurrentDate.toISOString().split('T')[0]; 

    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    const currentTime = `${hours}:${minutes}:${seconds}`;

    const displayQuery = `SELECT c.class_name, c.schedule_date,
                            COUNT(DISTINCT cp.participant_id) AS participants, 
                            COUNT(DISTINCT ac.class_id) AS attendance 
                        FROM classes c
                        LEFT JOIN class_participants cp ON cp.class_id = c.class_id 
                        LEFT JOIN attendance_classes ac ON ac.class_id = cp.class_id 
                        WHERE c.trainer_id = ? 
                            AND (c.schedule_date < ? OR (c.schedule_date = ? AND c.end_time < ?))
                        GROUP BY c.class_id`;

    db.query(displayQuery, [user_id, currentDateString, currentDateString, currentTime], (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Database query failed", details: error.message });
        }
        res.json({ results });
    });
});

module.exports = router;
