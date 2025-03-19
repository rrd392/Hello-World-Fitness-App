const express = require('express');
const db = require('../db'); 
const router = express.Router();

router.get('/display/:user_id/:type', (req, res) => {
    const { user_id, type } = req.params; 
    let progressQuery;

    if(type == 'All'){

        progressQuery = `SELECT uwp.*, w.plan_name, w.type, wd.exercise_name, pd.* FROM user_workout_progress uwp
                    LEFT JOIN user_workout_progress_detail pd ON uwp.user_workout_progress_id = pd.user_workout_progress_id
                    INNER JOIN user_workout_plans u ON uwp.user_workout_id = u.user_workout_id
                    INNER JOIN workout_plans w ON u.workout_plan_id = w.workout_plan_id
                    LEFT JOIN workout_details wd ON pd.workout_detail_id = wd.workout_detail_id
                    WHERE u.user_id = ?`;

    }else if(type == 'Coach'){

        progressQuery = `SELECT uwp.*, w.plan_name, w.type, wd.exercise_name, pd.* FROM user_workout_progress uwp
                    LEFT JOIN user_workout_progress_detail pd ON uwp.user_workout_progress_id = pd.user_workout_progress_id
                    INNER JOIN user_workout_plans u ON uwp.user_workout_id = u.user_workout_id
                    INNER JOIN workout_plans w ON u.workout_plan_id = w.workout_plan_id
                    LEFT JOIN workout_details wd ON pd.workout_detail_id = wd.workout_detail_id
                    WHERE u.user_id = ? AND u.trainer_id IS NOT NULL`;


    }else if(type == 'Custom'){

        progressQuery = `SELECT uwp.*, w.plan_name, w.type, wd.exercise_name, pd.* FROM user_workout_progress uwp
                    LEFT JOIN user_workout_progress_detail pd ON uwp.user_workout_progress_id = pd.user_workout_progress_id
                    INNER JOIN user_workout_plans u ON uwp.user_workout_id = u.user_workout_id
                    INNER JOIN workout_plans w ON u.workout_plan_id = w.workout_plan_id
                    LEFT JOIN workout_details wd ON pd.workout_detail_id = wd.workout_detail_id
                    WHERE u.user_id = ? AND u.trainer_id IS NULL`;
    }
    

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
                    type: row.type,
                    sessions: []
                };
                formattedData.push(plan);
            }

            let session = plan.sessions.find(s => s.id === row.user_workout_progress_id);
            if (!session) {
                session = {
                    id: row.user_workout_progress_id,
                    user_workout_id: row.user_workout_id,
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

router.get('/displayFeedback/:user_workout_id', (req, res) => {
    const { user_workout_id } = req.params; 

    const displayQuery = `SELECT * FROM member_performance_feedback mpf
                        INNER JOIN user u ON mpf.trainer_id = u.user_id
                        WHERE mpf.user_workout_id = ?`;

    db.query(displayQuery, [user_workout_id], (error, feedbackResult) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        res.json({ success: true, progress: feedbackResult});       
    });
});

module.exports = router;
