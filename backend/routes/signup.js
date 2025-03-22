const express = require('express');
const db = require('../db'); 
const router = express.Router();

router.post('/signupProcess', (req, res) => {
    const { email, username, password, name, contact, dob, gender, height, weight, goal, membershipPlan } = req.body;

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if (age < 12) {
        return res.status(400).json({ success: false, message: 'You must be at least 12 years old to register.' });
    }

    db.query('SELECT username FROM user WHERE username = ?', [username], (err, existingUser) => {
        if (err) return res.status(500).json({ message: 'Database error.', error: err });
        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: 'Username already exists. Please choose another one.' });
        }

        const insertUserQuery = `
            INSERT INTO user (username, role, name, gender, email, password, contact_number, date_of_birth, height, weight, fitness_goals, date_joined) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        db.query(insertUserQuery, [username, "member", name, gender, email, password, contact, dob, height, weight, goal], (err, result) => {
            if (err) return res.status(500).json({ message: 'Database error.', error: err });

            db.query('SELECT * FROM membership WHERE membership_id = ?', [membershipPlan], (err, membershipResult) => {
                if (err) return res.status(500).json({ message: 'Database error.', error: err });
                if (membershipResult.length === 0) {
                    return res.status(400).json({ success: false, message: 'Invalid membership ID.' });
                }

                const { plan_name, price, duration } = membershipResult[0];
                const currentDate = new Date();
                const month = currentDate.toLocaleString('default', { month: 'long' });
                const year = currentDate.getFullYear();
                const updatedDescription = `${plan_name} - ${month} ${year}`;

                const startDate = new Date();
                const endDate = new Date();
                endDate.setMonth(startDate.getMonth() + duration);

                const startDateFormatted = startDate.toISOString().split('T')[0];
                const endDateFormatted = endDate.toISOString().split('T')[0];

                db.query('SELECT user_id FROM user WHERE username = ? LIMIT 1', [username], (err, userResult) => {
                    if (err) return res.status(500).json({ message: 'Database error.', error: err });
                    if (userResult.length === 0) {
                        return res.status(400).json({ message: 'User not found after insert.' });
                    }

                    const userId = userResult[0].user_id;
                    const status = 'Active';


                    db.query('INSERT INTO user_membership (membership_id, user_id, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)', 
                        [membershipPlan, userId, startDateFormatted, endDateFormatted, status], (err) => {
                            if (err) return res.status(500).json({ message: 'Database error.', error: err });

                            const paymentDate = new Date().toISOString().split('T')[0];
                            db.query('INSERT INTO transactions (user_id, description, amount, payment_status, payment_date) VALUES (?, ?, ?, ?, ?)', 
                                [userId, updatedDescription, price, "Paid", paymentDate], (err) => {
                                    if (err) return res.status(500).json({ message: 'Database error.', error: err });

                                    res.status(201).json({ success: true, user_id: userResult[0].user_id });
                                }
                            );
                        }
                    );
                });
            });
        });
    });
});



router.get('/displayMembership', (req, res) => {

    const displayQuery = `SELECT * FROM membership`;


    db.query(displayQuery, (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({results});
    });
});

module.exports = router;
