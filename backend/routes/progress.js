const express = require('express');
const db = require('../db'); 
const router = express.Router();

router.get('/display/:user_id/:type', (req, res) => {
    const { user_id, type } = req.params; 
    let progressQuery;

    if(type == 'All'){

        progressQuery = `SELECT uw.*, w.plan_name, wd.exercise_name FROM user_workout_progress uw
                    INNER JOIN user_workout_plans u ON uw.user_workout_id = u.user_workout_id
                    INNER JOIN workout_plans w ON u.workout_plan_id = w.workout_plan_id
                    INNER JOIN workout_details wd ON uw.workout_detail_id = wd.workout_detail_id
                    WHERE u.user_id = ?`;

    }else if(type == 'Coach'){

        progressQuery = `SELECT uw.*, w.plan_name, wd.exercise_name FROM user_workout_progress uw
                    INNER JOIN user_workout_plans u ON uw.user_workout_id = u.user_workout_id
                    INNER JOIN workout_plans w ON u.workout_plan_id = w.workout_plan_id
                    INNER JOIN workout_details wd ON uw.workout_detail_id = wd.workout_detail_id
                    WHERE u.user_id = ? AND u.trainer_id IS NOT NULL`;


    }else if(type == 'Custom'){

        progressQuery = `SELECT uw.*, w.plan_name, wd.exercise_name FROM user_workout_progress uw
                    INNER JOIN user_workout_plans u ON uw.user_workout_id = u.user_workout_id
                    INNER JOIN workout_plans w ON u.workout_plan_id = w.workout_plan_id
                    INNER JOIN workout_details wd ON uw.workout_detail_id = wd.workout_detail_id
                    WHERE u.user_id = ? AND u.trainer_id IS NULL`;
    }
    

    db.query(progressQuery, [user_id], (error, progressResult) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    
        res.json({ success: true, progress: progressResult});
                        
    });
});

module.exports = router;
