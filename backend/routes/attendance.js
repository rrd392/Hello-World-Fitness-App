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
                        if (check3Result.length > 0) {
                            return res.json({ success: false, message: "You already taken attendance." });
                        }
                        const insertQuery = `INSERT INTO attendance_classes (class_id, user_id, attendance_time, status)
                                            VALUES (?, ?, NOW(), "Present")`;

                        db.query(insertQuery, [class_id, userId], (error, results) => {
                            if (error) {
                                return res.status(500).json({ error: "Database query failed", details: error.message });
                            }
                            res.json({ success: true });
                        });
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

module.exports = router;
