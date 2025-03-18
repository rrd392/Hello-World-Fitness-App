const express = require('express');
const db = require('../db'); 
const router = express.Router();
const multer = require("multer");
const path = require("path");

router.get('/displayGeneral/:difficulty?', (req, res) => {
    const { difficulty } = req.params;
    let generalQuery;
    let parameters = ['General'];

    if (!difficulty || difficulty === "all"){
        generalQuery = `SELECT wp.*, COUNT(wpd.workout_detail_id) AS count
                        FROM workout_plans wp 
                        INNER JOIN  workout_plan_details wpd 
                        ON wp.workout_plan_id = wpd.workout_plan_id
                        WHERE type = ?
                        GROUP BY wp.workout_plan_id`;
    }else{
        generalQuery = `SELECT wp.*, COUNT(wpd.workout_detail_id) AS count
                        FROM workout_plans wp 
                        INNER JOIN  workout_plan_details wpd 
                        ON wp.workout_plan_id = wpd.workout_plan_id
                        WHERE type = ? AND difficulty = ?
                        GROUP BY wp.workout_plan_id`;

        parameters.push(difficulty);
    }

    db.query(generalQuery, parameters, (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({results});
    });
});

router.get('/displayCoach/:user_id/:difficulty?', (req, res) => {
    const { user_id, difficulty } = req.params;
    let generalQuery;
    let parameters = [user_id];

    if (!difficulty || difficulty === "all"){
        generalQuery = `SELECT wp.*, COUNT(wpd.workout_detail_id) AS count
                        FROM workout_plans wp 
                        INNER JOIN workout_plan_details wpd ON wp.workout_plan_id = wpd.workout_plan_id
                        INNER JOIN user_workout_plans uwp ON uwp.workout_plan_id = wp.workout_plan_id
                        WHERE uwp.user_id = ? AND uwp.trainer_id IS NOT NULL
                        GROUP BY wp.workout_plan_id`;
    }else{
        generalQuery = `SELECT wp.*, COUNT(wpd.workout_detail_id) AS count
                        FROM workout_plans wp 
                        INNER JOIN workout_plan_details wpd ON wp.workout_plan_id = wpd.workout_plan_id
                        INNER JOIN user_workout_plans uwp ON uwp.workout_plan_id = wp.workout_plan_id
                        WHERE uwp.user_id = ? AND uwp.trainer_id IS NOT NULL AND wp.difficulty = ?
                        GROUP BY wp.workout_plan_id`;

        parameters.push(difficulty);
    }

    db.query(generalQuery, parameters, (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({results});
    });
});

router.get('/displayCustom/:user_id/:day', (req, res) => {
    const { user_id, day } = req.params;
    let generalQuery;
    let parameters = [user_id];

    if (day === "All"){
        generalQuery = `SELECT wp.*, COUNT(wpd.workout_detail_id) AS count
                        FROM workout_plans wp 
                        INNER JOIN workout_plan_details wpd ON wp.workout_plan_id = wpd.workout_plan_id
                        INNER JOIN user_workout_plans uwp ON uwp.workout_plan_id = wp.workout_plan_id
                        WHERE uwp.user_id = ? AND uwp.trainer_id IS NULL
                        GROUP BY wp.workout_plan_id`;
    }else{
        generalQuery = `SELECT wp.*, COUNT(wpd.workout_detail_id) AS count
                        FROM workout_plans wp 
                        INNER JOIN workout_plan_details wpd ON wp.workout_plan_id = wpd.workout_plan_id
                        INNER JOIN user_workout_plans uwp ON uwp.workout_plan_id = wp.workout_plan_id
                        WHERE uwp.user_id = ? AND uwp.trainer_id IS NULL AND uwp.day_of_week = ?
                        GROUP BY wp.workout_plan_id`;

        parameters.push(day);
    }

    db.query(generalQuery, parameters, (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({results});
    });
});

router.get('/displayDetailPlan/:workout_plan_id', (req, res) => {
    const { workout_plan_id } = req.params;

    const detailPlanQuery = `SELECT wd.*, 
                            (SELECT COUNT(*) FROM workout_plan_details WHERE workout_plan_id = wp.workout_plan_id) AS count
                            FROM workout_plans wp 
                            INNER JOIN workout_plan_details wpd ON wp.workout_plan_id = wpd.workout_plan_id
                            INNER JOIN workout_details wd ON wpd.workout_detail_id = wd.workout_detail_id
                            WHERE wp.workout_plan_id = ?`;
    
    db.query(detailPlanQuery, [workout_plan_id], (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({results});
    });
});

router.post('/addPoints', (req, res) => {
    const user_id = req.body.user_id;
    const difficulty = req.body.difficulty;
    const workout_plan_id = req.body.workout_plan_id;
    const totalDuration = req.body.totalDuration;

    let completedExercise = [];
    try {
        completedExercise = Array.isArray(req.body.completedExercise) ? req.body.completedExercise : JSON.parse(req.body.completedExercise || "[]");
    } catch (err) {
        return res.status(400).json({ error: "Invalid completed exercise format" });
    }

    let workoutDetails = [];
    try {
        workoutDetails = Array.isArray(req.body.planDetails) ? req.body.planDetails : JSON.parse(req.body.planDetails || "[]");
    } catch (err) {
        return res.status(400).json({ error: "Invalid workout_details format" });
    }

    let progress = completedExercise.length / workoutDetails.length;

    let points;

    if (difficulty === "Beginner") {
        points = Math.floor(10 * progress);
    } else if (difficulty === "Intermediate") {
        points = Math.floor(20 * progress);
    } else if (difficulty === "Advanced") {
        points = Math.floor(30 * progress);
    } else {
        return res.status(400).json({ error: "Invalid difficulty level" });
    }
    
    const addPointsQuery = `INSERT INTO points (user_id, activity_type, points, date_received)
                            VALUES (?, ?, ?, NOW())`;

    const updateDurationQuery = `INSERT INTO user_workout_progress (user_workout_id, duration_taken, updated_at) 
        VALUES ((SELECT user_workout_id FROM user_workout_plans WHERE workout_plan_id = ? AND user_id = ?), ?, NOW())`;

    db.query(updateDurationQuery, [workout_plan_id, user_id, totalDuration], (error, result) => {
        if (error) {
            console.error('Error updating workout duration:', error);
            return res.status(500).json({ error: 'Database query failed' });
        }
        const userWorkoutProgressId = result.insertId;
    
        db.query(addPointsQuery, [user_id, 'workout', points], (error, results)=>{
            if (error) {
                return res.status(500).json({ error: "Database add points query failed" });
            }
            const queryValues = workoutDetails.map(workout => [
                userWorkoutProgressId, 
                workout.workout_detail_id, 
                completedExercise.includes(workout.workout_detail_id) ? 1 : 0
            ]);
            const flattenedValues = queryValues.flat(); 

            const addProgressQuery = `INSERT INTO user_workout_progress_detail (user_workout_progress_id, workout_detail_id, is_completed)
                                    VALUES ${queryValues.map(() => "(?, ?, ?)").join(", ")}`;

            db.query(addProgressQuery, flattenedValues, (error, progressResult)=>{
                if (error) {
                    return res.status(500).json({ error: "Database add progress query failed" });
                }
                res.json({success:true, points});
            });
        });
    });
});

router.post('/addUserWorkoutPlan', (req, res) => {
    const { user_id, workout_plan_id, selectedDay } = req.body;
    const addUserWorkoutPlanQuery = `INSERT INTO user_workout_plans (user_id, workout_plan_id, is_active, day_of_week)
                            VALUES (?, ?, ?, ?)`;
    
    db.query(addUserWorkoutPlanQuery, [user_id, workout_plan_id, 1, selectedDay], (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({success:true});
    });
});

const fs = require('fs');
const util = require('util');
const unlinkAsync = util.promisify(fs.unlink);

router.delete('/deleteUserWorkoutPlan', (req, res) =>{
    const { user_id, workout_plan_id, selectedDay } = req.body;
    let deleteUserWorkoutPlanQuery;
    let parameters = [user_id, workout_plan_id];

    const planTypeQuery = `SELECT type FROM workout_plans WHERE workout_plan_id = ?`;

    db.query(planTypeQuery, [workout_plan_id], (error, typeResult)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        const type = typeResult[0].type;

        if (type == "General"){
            if(selectedDay == "All"){
                deleteUserWorkoutPlanQuery = `DELETE FROM user_workout_plans WHERE user_id = ? AND workout_plan_id = ?`;
            }else{
                deleteUserWorkoutPlanQuery = `DELETE FROM user_workout_plans WHERE user_id = ? AND workout_plan_id = ? AND day_of_week = ?`;
                parameters.push(selectedDay)
            }
            
            db.query(deleteUserWorkoutPlanQuery, parameters, (error, results)=>{
                if (error) {
                    return res.status(500).json({ error: "Database query failed" });
                }
                res.json({success:true});
            });
        }else if(type == "Member"){
            const selectImageQuery = `SELECT workout_image FROM workout_plans WHERE workout_plan_id = ? `;

            db.query(selectImageQuery, [workout_plan_id], (error, imageResults)=>{
                if (error) {
                    return res.status(500).json({ error: "Database query failed" });
                }

                const workout_image = imageResults[0].workout_image;
    
                const filePath = path.join(__dirname, '../../../uploads', workout_image);
                if (fs.existsSync(filePath)) {
                    unlinkAsync(filePath);
                }

                deleteUserWorkoutPlanQuery = `DELETE FROM user_workout_plans WHERE user_id = ? AND workout_plan_id = ?`;
                const deleteWorkoutPlanQuery = `DELETE FROM workout_plans WHERE workout_plan_id = ?`;
                
                db.query(deleteUserWorkoutPlanQuery, parameters, (error, results)=>{
                    if (error) {
                        return res.status(500).json({ error: "Database query failed" });
                    }
                    db.query(deleteWorkoutPlanQuery, [workout_plan_id], (error, deleteResults)=>{
                        if (error) {
                            return res.status(500).json({ error: "Database query failed" });
                        }
                        res.json({success:true});
                    });
                });
            });
        }
    });
});

router.get('/displayWorkoutDetail', (req, res) => {

    const detailPlanQuery = `SELECT * FROM workout_details`;
    const detailTypeQuery = `SELECT exercise_type FROM workout_details GROUP BY exercise_type`;
    
    db.query(detailPlanQuery, (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        db.query(detailTypeQuery, (error, type)=>{
            if (error) {
                return res.status(500).json({ error: "Database query failed" });
            }
            res.json({results, type});
        });
    });
});

const storage = multer.diskStorage({
    destination: path.resolve(__dirname, '../../../uploads/workout_image'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

router.post('/createWorkoutPlan', upload.single("image"), async (req, res) => {
    try {
        const addData = JSON.parse(req.body.addData);
        const user_id = req.body.userId; 

        let workoutDetails = [];
        try {
            workoutDetails = Array.isArray(req.body.workout_details) ? req.body.workout_details : JSON.parse(req.body.workout_details || "[]");
        } catch (err) {
            return res.status(400).json({ error: "Invalid workout_details format" });
        }

        const { name, description, difficulty, day } = addData;
        const imageUrl = `workout_image/${req.file.filename}`;

        // Check if plan name already exists
        const checkPlanNameQuery = "SELECT * FROM workout_plans WHERE plan_name = ?";
        db.query(checkPlanNameQuery, [name], (error, result) => {
            if (error) return res.status(500).json({ error: "Database query failed" });

            if (result.length > 0) {
                return res.status(400).json({ success: false, message: 'Plan name already exists. Please choose another one.' });
            }

            // Insert new workout plan
            const addNewPlanQuery = `INSERT INTO workout_plans (plan_name, description, difficulty, type, workout_image)
                                     VALUES (?, ?, ?, ?, ?)`;

            db.query(addNewPlanQuery, [name, description, difficulty, 'Member', imageUrl], (error, results) => {
                if (error) return res.status(500).json({ error: "Database query failed" });

                // Retrieve new workout plan ID
                const getWorkoutPlanID = 'SELECT workout_plan_id FROM workout_plans WHERE plan_name = ?';
                db.query(getWorkoutPlanID, [name], (error, idResult) => {
                    if (error) return res.status(500).json({ error: "Database query failed" });

                    const workout_plan_id = idResult[0].workout_plan_id;

                    // Insert into user_workout_plans
                    const addUserWorkoutPlan = `INSERT INTO user_workout_plans (user_id, workout_plan_id, is_active, day_of_week)
                                                VALUES (?, ?, ?, ?)`;
                    db.query(addUserWorkoutPlan, [user_id, workout_plan_id, 1, day], (error) => {
                        if (error) return res.status(500).json({ error: "Database query failed" });

                        // Loop through workoutDetails array and insert each workout_detail_id
                        if (workoutDetails.length > 0) {
                            const addWorkoutDetailQuery = `INSERT INTO workout_plan_details (workout_detail_id, workout_plan_id)
                                                           VALUES ?`;

                            const workoutDetailValues = workoutDetails.map(workout_detail_id => [workout_detail_id, workout_plan_id]);

                            db.query(addWorkoutDetailQuery, [workoutDetailValues], (error) => {
                                if (error) return res.status(500).json({ error: "Failed to insert workout details" });

                                return res.json({ success: true, message: "Workout plan created successfully!" });
                            });
                        } else {
                            return res.json({ success: true, message: "Workout plan created successfully, but no workout details added." });
                        }
                    });
                });
            });
        });

    } catch (err) {
        return res.status(400).json({ error: "Invalid request data" });
    }
});

router.get('/displayUserPlan/:user_id', (req, res) => {
    const {user_id} = req.params;

    const userPlanQuery = `SELECT plan_name FROM membership m
                            INNER JOIN user_membership um ON m.membership_id = um.membership_id
                            WHERE um.user_id = ?`;
    
    db.query(userPlanQuery, [user_id], (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({plan_name : results[0].plan_name});
    });
});

module.exports = router;
