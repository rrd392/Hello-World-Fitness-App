const express = require('express');
const db = require('../db'); 
const router = express.Router();

router.get('/displayMeals', (req, res) => {

    const displayQuery = `SELECT * FROM meal`;

    db.query(displayQuery, (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({results});
    });
});

router.get('/displayMealData/:user_id', (req, res) => {
    const { user_id } = req.params;

    const goalsQuery = `SELECT fitness_goals FROM user WHERE user_id = ?`;

    db.query(goalsQuery, [user_id], (error, goals) => {
        if (error) {
            return res.status(500).json({ error: "Database goal query failed" });
        }

        const fitness_goals = goals[0].fitness_goals || ""; 

        const displayQuery = `SELECT sm.set_meal_id, sm.meal_name, m.meal_id, m.name, m.serving_size, m.meal_pictures
                            FROM set_meal sm
                            INNER JOIN set_meal_details smd ON sm.set_meal_id = smd.set_meal_id
                            INNER JOIN meal m ON smd.meal_id = m.meal_id
                            WHERE sm.meal_type = ?
                            ORDER BY sm.set_meal_id`;

        db.query(displayQuery, [fitness_goals], (error, results) => {
            if (error) {
                return res.status(500).json({ error: "Database query failed" });
            }
            const formattedMeals = formatMeals(results); 
            
            res.json({ meal: formattedMeals });

        });
    });
});

const formatMeals = (rows) => {
    const mealsMap = {};
    rows.forEach(row => {
        if (!mealsMap[row.set_meal_id]) {
            mealsMap[row.set_meal_id] = {
                id: row.set_meal_id,
                title: row.meal_name,
                items: []
            };
        }
        mealsMap[row.set_meal_id].items.push({
            meal_id: row.meal_id,
            name: row.name,
            portion: row.serving_size,
            image: row.meal_pictures 
        });
    });

    return Object.values(mealsMap);
};


module.exports = router;
