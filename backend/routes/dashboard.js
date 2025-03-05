const express = require('express');
const db = require('../db'); 
const router = express.Router();

router.get('/display/:user_id', (req, res) => {
    const { user_id } = req.params; 
    const currentDate = new Date();  // Get current date-time

    const userQuery = `SELECT name FROM user WHERE user_id = ?`;

    const query = `
        SELECT c.class_name, c.schedule_date, c.start_time, c.end_time, c.class_image, f.name AS trainerName
        FROM class_participants cp 
        INNER JOIN classes c ON cp.class_id = c.class_id
        INNER JOIN user f ON c.trainer_id = f.user_id
        WHERE cp.user_id = ? AND c.schedule_date > '2025-01-01' ORDER BY c.schedule_date LIMIT 1
    `;

    const classQuery = 'SELECT * FROM classes LIMIT 5';

    const workoutPlansQuery = 'SELECT * FROM workout_plans LIMIT 5';

    const dietQuery = 'SELECT * FROM meal LIMIT 5';

    const notificationQuery = `SELECT * FROM notifications n
                            INNER JOIN user u ON n.user_id = u.user_id
                            INNER JOIN class_participants cp ON n.class_id = cp.class_id
                            INNER JOIN user s ON cp.user_id = s.user_id
                            WHERE u.user_id = ?`;

    db.query(userQuery, [user_id], (error, userResult) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        const userName = userResult[0].name;
        db.query(query, [user_id], (error, results) => {
            if (error) {
                console.error("Database error:", error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
            db.query(classQuery, (error, classes) => {
                if (error) {
                    console.error("Database error:", error);
                    return res.status(500).json({ success: false, message: "Internal server error" });
                }
                db.query(workoutPlansQuery, (error, workoutPlans) => {
                    if (error) {
                        console.error("Database error:", error);
                        return res.status(500).json({ success: false, message: "Internal server error" });
                    }
                    db.query(dietQuery, (error, diet) => {
                        if (error) {
                            console.error("Database error:", error);
                            return res.status(500).json({ success: false, message: "Internal server error" });
                        }

                        res.json({ success: true, classes: results[0], userName, disClass: classes, workoutPlans: workoutPlans, diet:diet});
                    });
                });
            });
        });
    });
});

module.exports = router;
