const express = require('express');
const db = require('../db'); 
const router = express.Router();

router.get('/display/:user_id', (req, res) => {
    const { user_id } = req.params; 

    const userQuery = `SELECT name FROM user WHERE user_id = ?`;

    const membershipQuery = `SELECT m.plan_name FROM user_membership um
                            INNER JOIN membership m ON um.membership_id = m.membership_id 
                            WHERE user_id = ?`;

    const query = `
        SELECT c.class_name, c.schedule_date, c.start_time, c.end_time, c.class_image, f.name AS trainerName
        FROM class_participants cp 
        INNER JOIN classes c ON cp.class_id = c.class_id
        INNER JOIN user f ON c.trainer_id = f.user_id
        WHERE cp.user_id = ? AND (c.schedule_date > ? OR ( c.schedule_date = ? AND c.start_time > ?)) 
        ORDER BY c.schedule_date LIMIT 1
    `;

    const currentDate = new Date();
    const localCurrentDate = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000); 
    const currentDateString = localCurrentDate.toISOString().split('T')[0];
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    const currentTime = `${hours}:${minutes}:${seconds}`;

    const classQuery = `SELECT c.*, u.*, COUNT(cp.class_id) AS participants FROM classes c
                        INNER JOIN user u ON c.trainer_id = u.user_id
                        LEFT JOIN class_participants cp ON c.class_id = cp.class_id
                        GROUP BY c.class_id
                        ORDER BY c.schedule_date LIMIT 5`;

    const workoutPlansQuery = 'SELECT * FROM workout_plans WHERE type = "General" LIMIT 5';

    const dietQuery = 'SELECT * FROM meal LIMIT 5';

    db.query(userQuery, [user_id], (error, userResult) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        const userName = userResult[0].name;
        db.query(query, [user_id, currentDateString, currentDateString, currentTime ], (error, results) => {
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
                        db.query(membershipQuery, [user_id], (error, membership) => {
                            if (error) {
                                console.error("Database error:", error);
                                return res.status(500).json({ success: false, message: "Internal server error" });
                            }

                            res.json({ success: true, classes: results[0], userName, disClass: classes, workoutPlans: workoutPlans, diet:diet, membership:membership[0].plan_name});
                        });
                    });
                });
            });
        });
    });
});

router.get('/displayTrainer/:user_id', (req, res) => {
    const { user_id } = req.params; 

    const userQuery = `SELECT name FROM user WHERE user_id = ?`;

    const query = `SELECT c.*, u.name
                    FROM classes c
                    INNER JOIN user u ON c.trainer_id = u.user_id
                    WHERE c.trainer_id = ? AND (c.schedule_date > ? OR ( c.schedule_date = ? AND c.start_time > ?)) 
                    ORDER BY c.schedule_date LIMIT 1`;

    const currentDate = new Date();
    const localCurrentDate = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000); 
    const currentDateString = localCurrentDate.toISOString().split('T')[0];
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    const currentTime = `${hours}:${minutes}:${seconds}`;

    const classQuery = `SELECT c.*, u.*, COUNT(cp.class_id) AS participants FROM classes c
                        INNER JOIN user u ON c.trainer_id = u.user_id
                        LEFT JOIN class_participants cp ON c.class_id = cp.class_id
                        WHERE c.schedule_date > ? OR (c.schedule_date = ? AND c.start_time > ?)
                        GROUP BY c.class_id
                        ORDER BY c.schedule_date LIMIT 5`;

    const workoutPlansQuery = 'SELECT * FROM workout_plans WHERE type = "General" LIMIT 5';

    const memberQuery = 'SELECT * FROM member_trainer mt INNER JOIN user u ON mt.member_id = u.user_id WHERE mt.trainer_id = ? LIMIT 5';

    db.query(userQuery, [user_id], (error, userResult) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        const userName = userResult[0].name;
        db.query(query, [user_id, currentDateString, currentDateString, currentTime ], (error, results) => {
            if (error) {
                console.error("Database error:", error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
            db.query(classQuery, [currentDateString, currentDateString, currentTime], (error, classes) => {
                if (error) {
                    console.error("Database error:", error);
                    return res.status(500).json({ success: false, message: "Internal server error" });
                }
                db.query(workoutPlansQuery, (error, workoutPlans) => {
                    if (error) {
                        console.error("Database error:", error);
                        return res.status(500).json({ success: false, message: "Internal server error" });
                    }
                    db.query(memberQuery, [user_id], (error, member) => {
                        if (error) {
                            console.error("Database error:", error);
                            return res.status(500).json({ success: false, message: "Internal server error" });
                        }
                        res.json({ success: true, classes: results[0], userName, disClass: classes, workoutPlans: workoutPlans, member:member});
                    });
                });
            });
        });
    });
});

module.exports = router;
