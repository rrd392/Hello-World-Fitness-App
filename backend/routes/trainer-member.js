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

router.get('/displayProgress/:user_id', (req, res) => {
    const { user_id } = req.params; 

    const progressQuery = `SELECT uwp.*, w.plan_name, wd.exercise_name, pd.* FROM user_workout_progress uwp
                    LEFT JOIN user_workout_progress_detail pd ON uwp.user_workout_progress_id = pd.user_workout_progress_id
                    INNER JOIN user_workout_plans u ON uwp.user_workout_id = u.user_workout_id
                    INNER JOIN workout_plans w ON u.workout_plan_id = w.workout_plan_id
                    LEFT JOIN workout_details wd ON pd.workout_detail_id = wd.workout_detail_id
                    WHERE u.user_id = ? AND u.trainer_id IS NOT NULL`;
    
    db.query(progressQuery, [user_id], (error, progressResult) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }

        const formattedData = [];

        progressResult.forEach(row => {
            let plan = formattedData.find(p => p.title === row.plan_name);
            if (!plan) {
                plan = {
                    title: row.plan_name,
                    sessions: []
                };
                formattedData.push(plan);
            }

            let session = plan.sessions.find(s => s.id === row.user_workout_progress_id);
            if (!session) {
                session = {
                    id: row.user_workout_progress_id,
                    time: `${Math.floor(row.duration_taken / 60)}:${String(row.duration_taken % 60).padStart(2, '0')}`,
                    date: new Date(row.updated_at).toLocaleDateString('en-GB'),
                    exercises: []
                };
                plan.sessions.push(session);
            }

            if (row.exercise_name) {
                session.exercises.push({
                    name: row.exercise_name,
                    completed: row.is_completed === 1
                });
            }
        });    
        res.json({ success: true, progress: formattedData});
                        
    });
});

module.exports = router;
