const express = require('express');
const db = require('../db'); 
const router = express.Router();

router.get('/displayMemberWorkout/:trainer_id/:member_id', (req, res) => {
    const { trainer_id, member_id } = req.params; 
    
    const displayQuery = `SELECT uw.*, wp.plan_name FROM user_workout_plans uw
                        INNER JOIN workout_plans wp ON uw.workout_plan_id = wp.workout_plan_id
                        WHERE uw.trainer_id = ? AND uw.user_id = ?`;
    
    db.query(displayQuery, [trainer_id, member_id], (error, displayResult) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    
        res.json({ success: true, progress: displayResult});
                        
    });
});

router.get('/displayWorkoutDetails/:workout_plan_id', (req, res) => {
    const { workout_plan_id } = req.params; 
    
    const displayQuery = `SELECT wd.* FROM workout_plan_details wpd 
                        INNER JOIN workout_details wd ON wpd.workout_detail_id = wd.workout_detail_id
                        WHERE wpd.workout_plan_id = ?`;
    
    db.query(displayQuery, [workout_plan_id], (error, displayResult) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    
        res.json({ success: true, progress: displayResult});
                        
    });
});

router.get('/displayWorkoutPlan/:workout_plan_id', (req, res) => {
    const { workout_plan_id } = req.params; 
    
    const displayQuery = `SELECT * FROM workout_plans 
                        WHERE workout_plan_id = ?`;
    
    db.query(displayQuery, [workout_plan_id], (error, displayResult) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    
        res.json({ success: true, progress: displayResult[0]});
                        
    });
});

router.delete('/deleteWorkoutDetail', (req, res) =>{
    const { workout_detail_id, workout_plan_id } = req.body;

    const deleteQuery = `DELETE FROM workout_plan_details WHERE workout_detail_id = ? AND workout_plan_id = ?`;

    db.query(deleteQuery, [workout_detail_id, workout_plan_id], (error, deleteResult)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        
        res.json({success:true});
    });
});

router.post('/addWorkoutDetail', (req, res) =>{
    const { workout_detail_id, workout_plan_id } = req.body;

    const checkQuery = `SELECT * FROM workout_plan_details WHERE workout_detail_id = ? AND workout_plan_id = ?`;
    const insertQuery = `INSERT INTO workout_plan_details (workout_detail_id, workout_plan_id)
                        VALUES (?,?)`;
    const fetchQuery = `SELECT wd.* FROM workout_plan_details wpd
                        INNER JOIN workout_details wd ON wpd.workout_detail_id = wd.workout_detail_id 
                        WHERE id = ?`;

    db.query(checkQuery, [workout_detail_id, workout_plan_id], (error, checkResult)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        if(checkResult.length >0){
            return res.json({success:false, message: "Exercise already added to workout plan."});
        }
        db.query(insertQuery, [workout_detail_id, workout_plan_id], (error, insertResult)=>{
            if (error) {
                return res.status(500).json({ error: "Database query failed" });
            }
            const id = insertResult.insertId; 

            db.query(fetchQuery, [id], (error, result) => {
                if (error) {
                    return res.status(500).json({ error: "Failed to retrieve inserted row" });
                }
                res.json({ success: true, result: result[0] }); 
            });
        });
    });
});

router.post('/updateWorkoutPlan', (req, res) =>{
    const { planName, description, workout_plan_id } = req.body;

    const updateQuery = `UPDATE workout_plans SET plan_name = ?, description = ? WHERE workout_plan_id = ?`;

    db.query(updateQuery, [planName, description, workout_plan_id], (error, checkResult)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        
        res.json({ success: true }); 
            
    });
});

module.exports = router;
