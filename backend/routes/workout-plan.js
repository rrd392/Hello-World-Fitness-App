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
    const { user_id, difficulty } = req.body;
    let points;

    if(difficulty == "Beginner"){
        points = 10;
    }else if(difficulty == "Intermediate"){
        points = 20;
    }else if(difficulty == "Advanced"){
        points = 30;
    }else{
        return res.status(400).json({ error: "Invalid difficulty level" });
    }

    const addPointsQuery = `INSERT INTO points (user_id, activity_type, points, date_received)
                            VALUES (?, ?, ?, NOW())`;
    
    db.query(addPointsQuery, [user_id, 'workout', points], (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({success:true, points});
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

router.delete('/deleteUserWorkoutPlan', (req, res) =>{
    const { user_id, workout_plan_id, selectedDay } = req.body;
    let deleteUserWorkoutPlanQuery;
    let parameters = [user_id, workout_plan_id];
    
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

router.post('/createWorkoutPlan', upload.single("image"), (req, res) => {
    const { name, description, difficulty, image } = req.body.addData;
    const {workoutDetails} = req.body.workout_details;

    const imageUrl = `workout_image/${req.file.filename}`;

    const addNewPlanQuery = `INSERT INTO workout_plans (plan_name, description, difficulty, type, workout_image)
                            VALUES (?, ?, ?, ?, ?)`;
    
    db.query(addNewPlanQuery, [name, description, difficulty, 'Member', imageUrl], (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({success:true, points});
    });
});

module.exports = router;
