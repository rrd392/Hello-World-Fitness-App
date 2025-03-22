const express = require('express');
const db = require('../db'); 
const router = express.Router();

router.post('/insertAttendance', (req, res) => {
    const { userId, code } = req.body;   

    const checkQuery = `SELECT * FROM attendance_code WHERE code = ? AND available_from < NOW() AND available_until > NOW()`;
    
    db.query(checkQuery, [code], (error, checkResult) => {
        if (error) {
            return res.status(500).json({ error: "Database query failed", details: error.message });
        }
        
        if (checkResult.length > 0) {
            if (checkResult[0].class_id !== null) {
                const class_id = checkResult[0].class_id;

                const check2Query = `SELECT * FROM class_participants WHERE class_id = ? AND user_id = ?`;
                db.query(check2Query, [class_id, userId], (error, check2Result) => {
                    if (error) {
                        return res.status(500).json({ error: "Database query failed", details: error.message });
                    }
                    if (check2Result.length === 0) {
                        return res.json({ success: false, message: "You do not belong to this class." });
                    }

                    const check3Query = `SELECT * FROM attendance_classes WHERE class_id = ? AND user_id = ?`;

                    db.query(check3Query, [class_id, userId], (error, check3Result) => {
                        if (error) {
                            return res.status(500).json({ error: "Database query failed", details: error.message });
                        }
                        if (check3Result.length > 0 && check3Result[0].status == "Present") {
                            return res.json({ success: false, message: "You already taken attendance." });
                        }else if(check3Result.length > 0 && check3Result[0].status == "Absent"){
                            const updateQuery = `UPDATE attendance_classes SET status = "Present", attendance_time = NOW() WHERE user_id = ? AND class_id = ?`;
                            db.query(updateQuery, [userId, class_id], (error, results) => {
                                if (error) {
                                    return res.status(500).json({ error: "Database query failed", details: error.message });
                                }
                                res.json({ success: true });
                            });
                        }else{
                            const insertQuery = `INSERT INTO attendance_classes (class_id, user_id, attendance_time, status)
                                                VALUES (?, ?, NOW(), "Present")`;

                            db.query(insertQuery, [class_id, userId], (error, results) => {
                                if (error) {
                                    return res.status(500).json({ error: "Database query failed", details: error.message });
                                }
                                res.json({ success: true });
                            });
                        }
                    });
                });
            } else {
                const insertQuery = `INSERT INTO attendance_gym (user_id, check_in_time) VALUES (?, NOW())`;

                db.query(insertQuery, [userId], (error, results) => {
                    if (error) {
                        return res.status(500).json({ error: "Database query failed", details: error.message });
                    }
                    res.json({ success: true });
                });
            }
        } else {
            res.json({ success: false, message: "Wrong OTP. Failed to update attendance." });
        }
    });
});

router.get('/displayAttendanceHistory/:user_id', (req, res) => {
    const { user_id } = req.params;

    const displayClassQuery = `SELECT *
                        FROM attendance_classes 
                        WHERE user_id = ?`;

    const displayGymQuery = `SELECT *
                        FROM attendance_gym 
                        WHERE user_id = ?`;

    db.query(displayClassQuery, [user_id], (error, classResults) => {
        if (error) {
            return res.status(500).json({ error: "Database query failed", details: error.message });
        }
        db.query(displayGymQuery, [user_id], (error, gymResults) => {
            if (error) {
                return res.status(500).json({ error: "Database query failed", details: error.message });
            }
            res.json({ classResults,  gymResults});
        });
    });
});

router.post('/updateAttendance', (req, res) => {
    const { userId } = req.body;

    const currentDate = new Date();
    const localCurrentDate = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000); 
    const currentDateString = localCurrentDate.toISOString().split('T')[0];
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    const currentTime = `${hours}:${minutes}:${seconds}`;

    const insertQuery = `INSERT INTO attendance_classes (class_id, user_id, attendance_time, status)
                        SELECT cp.class_id, cp.user_id, c.schedule_date, 'Absent'
                        FROM class_participants cp
                        INNER JOIN classes c ON cp.class_id = c.class_id
                        LEFT JOIN attendance_classes ac ON cp.class_id = ac.class_id AND cp.user_id = ac.user_id
                        WHERE cp.user_id = ?
                        AND (c.schedule_date < ? OR (c.schedule_date = ? AND c.end_time < ?))
                        AND ac.class_id IS NULL`;

    db.query(insertQuery, [userId, currentDateString, currentDateString, currentTime], (error, classResults) => {
        if (error) {
            return res.status(500).json({ error: "Database query failed", details: error.message });
        }
        
        res.json({ success:true});
              
    });
});

module.exports = router;
