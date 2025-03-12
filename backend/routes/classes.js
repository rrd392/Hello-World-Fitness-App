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

        const addUserClassQuery = `INSERT INTO class_participants (class_id, user_id)
                                    VALUES (?, ?)`;
        
        db.query(addUserClassQuery, [class_id, user_id], (error, results)=>{
            if (error) {
                return res.status(500).json({ error: "Database query failed" });
            }
            res.json({success:true});
        });
    });
});

router.get('/displayUpcomingClasses/:user_id', (req, res) => {
    const {user_id} = req.params;

    const classesQuery = `SELECT c.*, u.* FROM class_participants cp
                            INNER JOIN classes c ON cp.class_id = c.class_id
                            INNER JOIN user u ON c.trainer_id = u.user_id
                            WHERE cp.user_id = ? AND c.schedule_date >= NOW()`;
    
    db.query(classesQuery, [user_id], (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({results});
    });
});

module.exports = router;