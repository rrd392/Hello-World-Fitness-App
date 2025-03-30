const express = require('express');
const db = require('../db'); 
const router = express.Router();
const multer = require("multer");
const path = require("path");

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

    const checkQuery = `SELECT * FROM workout_plans WHERE plan_name = ? AND workout_plan_id != ?`;
    const updateQuery = `UPDATE workout_plans SET plan_name = ?, description = ? WHERE workout_plan_id = ?`;

    db.query(checkQuery, [planName, workout_plan_id], (error, checkResult)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        if(checkResult.length > 0){
            return res.json({ success: false, message: 'Plan name already exist. Please choose another one.' }); 
        }
        db.query(updateQuery, [planName, description, workout_plan_id], (error, updateResult)=>{
            if (error) {
                return res.status(500).json({ error: "Database query failed" });
            }
            
            res.json({ success: true }); 
                
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
        const addData = JSON.parse(req.body.workoutPlan);
        const trainer_id = req.body.trainerId;
        const member_id = req.body.memberId; 
        const category = req.body.category;

        // Ensure workoutDetails is an array
        let workoutDetails;
        try {
            workoutDetails = JSON.parse(req.body.workout_details);
            if (!Array.isArray(workoutDetails)) throw new Error("Invalid format");
        } catch (err) {
            return res.status(400).json({ error: "Invalid workout_details format" });
        }

        const { plan_name, description, difficulty } = addData;
        const imageUrl = req.file ? `workout_image/${req.file.filename}` : null;
        const type = category === "Coach" ? "Coach" : "General";

        // Check if plan name already exists
        const checkPlanNameQuery = "SELECT * FROM workout_plans WHERE plan_name = ?";
        db.query(checkPlanNameQuery, [plan_name], (error, result) => {
            if (error) return res.status(500).json({ error: "Database query failed" });

            if (result.length > 0) {
                return res.status(400).json({ success: false, message: 'Plan name already exists. Please choose another one.' });
            }

            // Insert new workout plan
            const addNewPlanQuery = `INSERT INTO workout_plans (plan_name, description, difficulty, type, workout_image)
                                     VALUES (?, ?, ?, ?, ?)`;

            db.query(addNewPlanQuery, [plan_name, description, difficulty, type, imageUrl], (error, results) => {
                if (error) return res.status(500).json({ error: "Database query failed" });

                // Retrieve new workout plan ID
                const getWorkoutPlanID = 'SELECT workout_plan_id FROM workout_plans WHERE plan_name = ?';
                db.query(getWorkoutPlanID, [plan_name], (error, idResult) => {
                    if (error) return res.status(500).json({ error: "Database query failed" });

                    const workout_plan_id = idResult[0].workout_plan_id;

                    // Insert workout details if available
                    if (workoutDetails.length > 0) {
                        const addWorkoutDetailQuery = `INSERT INTO workout_plan_details (workout_detail_id, workout_plan_id)
                                                        VALUES ?`;

                        const workoutDetailValues = workoutDetails.map(workout_detail_id => [workout_detail_id, workout_plan_id]);

                        db.query(addWorkoutDetailQuery, [workoutDetailValues], (error) => {
                            if (error) return res.status(500).json({ error: "Failed to insert workout details" });

                            if (category === "Coach") {
                                // Insert into user_workout_plans
                                const addUserWorkoutPlan = `INSERT INTO user_workout_plans (user_id, workout_plan_id, is_active, trainer_id)
                                                            VALUES (?, ?, ?, ?)`;

                                db.query(addUserWorkoutPlan, [member_id, workout_plan_id, 1, trainer_id], (error) => {
                                    if (error) return res.status(500).json({ error: "Database query failed" });

                                    return res.json({ success: true, message: "Workout plan created successfully!" });
                                });
                            } else {
                                return res.json({ success: true, message: "Workout plan created successfully!" });
                            }
                        });
                    } else {
                        return res.json({ success: true, message: "Workout plan created successfully, but no workout details added." });
                    }
                });
            });
        });

    } catch (err) {
        return res.status(400).json({ error: "Invalid request data" });
    }
});

const fs = require('fs');
const util = require('util');
const unlinkAsync = util.promisify(fs.unlink);

router.delete('/deleteWorkoutPlan', (req, res) =>{
    const { workout_plan_id } = req.body;
    const selectQuery = `SELECT workout_image FROM workout_plans WHERE workout_plan_id = ?`;
    const deleteQuery = `DELETE FROM workout_plans WHERE workout_plan_id = ?`;
    db.query(selectQuery, [ workout_plan_id], (error, imageResults)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        const workout_image = imageResults[0].workout_image;
            
        const filePath = path.join(__dirname, '../../../uploads', workout_image);
        if (fs.existsSync(filePath)) {
            unlinkAsync(filePath);
        }

        db.query(deleteQuery, [ workout_plan_id], (error, deleteResult)=>{
            if (error) {
                return res.status(500).json({ error: "Database query failed" });
            }
            
            res.json({success:true});
        });
    });
});

router.get('/displayGeneralWorkout', (req, res) => {
    
    const displayQuery = `SELECT wp.*, COUNT(*) AS count FROM workout_plans wp
                        INNER JOIN workout_plan_details wpd ON wp.workout_plan_id = wpd.workout_plan_id
                        WHERE type = ?
                        GROUP BY wp.workout_plan_id`;
    
    db.query(displayQuery, ["General"], (error, displayResult) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        res.json({ success: true, progress: displayResult});
                        
    });
});

module.exports = router;
