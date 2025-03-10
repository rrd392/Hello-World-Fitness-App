const express = require('express');
const db = require('../db'); 
const router = express.Router();
const multer = require("multer");
const path = require("path");

router.get('/displayUserData/:user_id', (req, res) => {
    const {user_id} = req.params;

    const displayQuery = `SELECT * FROM user u
                        INNER JOIN user_membership um ON u.user_id = um.user_id
                        INNER JOIN membership m ON um.membership_id = m.membership_id
                        WHERE u.user_id = ?`;


    db.query(displayQuery, [user_id], (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results[0]);
    });
});

const storage = multer.diskStorage({
    destination: path.resolve(__dirname, '../../../uploads/profile_pictures'), 
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    },
});

const upload = multer({ storage });

router.post("/uploadImage", upload.single("image"), (req, res) => {
    const userId = req.body.userId; 

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const imageUrl = `profile_pictures/${req.file.filename}`;

    const uploadImageQuery = `UPDATE user SET profile_picture = ? WHERE user_id = ?`;
    db.query(uploadImageQuery, [imageUrl, userId], (error, results) => {
        if (error) {
            console.log("Database Error:", error);
            return res.status(500).json({ message: "Database update failed" });
        }
        res.json({ imageUrl });
    });
});

router.put('/updateUser', (req, res) => {
    const {email, username,password,name,contact,dob,gender,height,weight,goal,dateJoined,profileImage,membershipPlan} = req.body.updateData;
    const user_id = req.body.userId;
    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };
    
    if (calculateAge(dob) < 12) {
        return res.status(400).json({ success:false, message: 'You must be at least 12 years old to register.' });
    }

    const updateQuery = `
    UPDATE user
    SET name = ?, gender = ?, email = ?, contact_number = ?, date_of_birth = ?, height = ?, weight = ?, fitness_goals = ?, profile_picture = ?
    WHERE user_id = ?
    `;

    db.query(updateQuery, [name, gender, email, contact, dob, height, weight, goal, profileImage, user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while updating member.' });
        }
        if (result.affectedRows > 0) {
            
            res.status(200).json({ success:true, message: 'Member info updated successfully!' });
                    
        } else {
            res.status(404).json({ message: 'Member not found.' });
        }
    });
});

router.get('/displayMembershipPlan', (req, res) => {

    const displayQuery = `SELECT * FROM membership`;


    db.query(displayQuery, (error, membershipPlan)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({membershipPlan});
    });
});

router.get('/displayUserMembership/:user_id', (req, res) => {
    const { user_id } = req.params;

    const displayQuery = `SELECT *, u.profile_picture FROM user_membership um 
                        INNER JOIN user u ON um.user_id = u.user_id
                        WHERE u.user_id = ?`;

    db.query(displayQuery, [user_id], (error, results) => {
        if (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ error: "Database query failed" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "No user membership found" });
        }

        res.json( {userData : results[0]});
    });
});

router.get('/displayTransactions/:user_id', (req, res) => {
    const { user_id } = req.params;

    const displayQuery = `SELECT * FROM transactions WHERE user_id = ?`;
    const contactQuery = `SELECT contact_number FROM user WHERE user_id = ?`;

    db.query(displayQuery, [user_id], (error, transactions) => {
        if (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ error: "Database query failed" });
        }
        db.query(contactQuery, [user_id], (error, contact) => {
            if (error) {
                console.error("Database query error:", error);
                return res.status(500).json({ error: "Database query failed" });
            }
            res.json( {transactions, contact: contact[0].contact_number});
        });
    });
});

router.get('/displayPoints/:user_id', (req, res) => {
    const {user_id} = req.params;

    const displayQuery = `SELECT SUM(points) AS totalPoints FROM points 
                        WHERE user_id = ?`;


    db.query(displayQuery, [user_id], (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({points:results[0].totalPoints});
    });
});

router.get('/displayUserPoints', (req, res) => {

    const displayQuery = `SELECT user.*, SUM(points) AS totalPoints FROM points 
                        INNER JOIN user ON points.user_id = user.user_id
                        GROUP BY points.user_id ORDER BY totalPoints DESC`;


    db.query(displayQuery, (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({results});
    });
});

router.get('/displayUserBadge/:user_id', (req, res) => {
    const { user_id } = req.params;

    const pointsQuery = `SELECT SUM(points) AS totalPoints FROM points WHERE user_id = ?`;

    db.query(pointsQuery, [user_id], (error, points) => {
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }

        const totalPoints = points[0].totalPoints || 0; 

        const badgesQuery = `SELECT * FROM badge`;

        db.query(badgesQuery, (error, badgeResult) => {
            if (error) {
                return res.status(500).json({ error: "Database query failed" });
            }

            const allBadges = badgeResult;

            const userCurrentBadgeQuery = `SELECT badge_id FROM user_badge WHERE user_id = ?`;

            db.query(userCurrentBadgeQuery, [user_id], (error, currentResult) => {
                if (error) {
                    return res.status(500).json({ error: "Database query failed" });
                }

                const userBadges = currentResult.map(row => row.badge_id); 

                const missingBadges = allBadges.filter(badge => !userBadges.includes(badge.badge_id));

                const eligibleBadges = missingBadges.filter(badge => totalPoints >= badge.points_needed);

                const nonEligibleBadges = missingBadges.filter(badge => totalPoints < badge.points_needed);

                if (eligibleBadges.length === 0) {
                    return fetchAndReturnUserBadges(user_id, nonEligibleBadges, res);
                }
                const currentDate = new Date();

                const insertQuery = `INSERT INTO user_badge (user_id, badge_id, earned_date) VALUES ?`;
                const insertValues = eligibleBadges.map(badge => [user_id, badge.badge_id, currentDate]);

                db.query(insertQuery, [insertValues], (error) => {
                    if (error) {
                        return res.status(500).json({ error: "Failed to insert new badges" });
                    }

                    // Step 7: Fetch updated user badges
                    fetchAndReturnUserBadges(user_id, nonEligibleBadges, res);
                });
            });
        });
    });
});

// Helper function to fetch and return user badges
function fetchAndReturnUserBadges(user_id, nonEligibleBadges, res) {
    const displayQuery = `
        SELECT * FROM user_badge ub
        INNER JOIN badge b ON ub.badge_id = b.badge_id
        WHERE ub.user_id = ?`;

    

    db.query(displayQuery, [user_id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json({ badges: results, other:nonEligibleBadges });
    });
}

module.exports = router;