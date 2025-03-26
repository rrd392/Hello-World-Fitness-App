const express = require('express');
const db = require('../db'); 
const router = express.Router();
const multer = require("multer");
const path = require("path");
const moment = require('moment');

router.get('/displayUserData/:user_id', (req, res) => {
    const {user_id} = req.params;

    const displayQuery = `SELECT * FROM user_membership um
                            INNER JOIN user u ON um.user_id = u.user_id
                            INNER JOIN membership m ON um.membership_id = m.membership_id
                            WHERE um.user_id = ?`;


    db.query(displayQuery, [user_id], (error, results)=>{
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results[0]);
    });
});

router.get('/displayTrainerData/:user_id', (req, res) => {
    const {user_id} = req.params;

    const displayQuery = `SELECT * FROM user 
                        WHERE user_id = ?`;


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

    // Blank field validation
    if ( !email || !name || !contact || !dob || !gender || !height || !weight || !goal) {
        return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }


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
            
            res.status(200).json({ success:true, message: 'User info updated successfully!' });
                    
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

                    fetchAndReturnUserBadges(user_id, nonEligibleBadges, res);
                });
            });
        });
    });
});

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



router.post("/update-membership", (req, res) => {
    
    const { user_id, membership_id, description, amount, payment_date } = req.body;

    // Determine membership plan duration
    let membership_plan;
    if (membership_id === 1 || membership_id === 3) {
        membership_plan = '1 month';
    } else if (membership_id === 2 || membership_id === 4) {
        membership_plan = '1 year';
    } else {
        return res.status(400).json({ error: "Invalid membership_id." });
    }

   
    const start_date = moment().format('YYYY-MM-DD');
    const end_date = membership_plan === '1 month'
        ? moment().add(1, 'month').format('YYYY-MM-DD')
        : moment().add(1, 'year').format('YYYY-MM-DD');

    
    db.beginTransaction((err) => {
        if (err) {
            console.error("Error starting transaction:", err);
            return res.status(500).json({ error: "Failed to start transaction", success: false });
        }

        // Update user_membership table
        const updateMembershipQuery = `
            UPDATE user_membership 
            SET membership_id = ?, start_date = ?, end_date = ?, status = 'Active'
            WHERE user_id = ?
        `;
        const updateMembershipValues = [membership_id, start_date, end_date, user_id];

        db.query(updateMembershipQuery, updateMembershipValues, (err, result) => {
            if (err) {
                return db.rollback(() => {
                    console.error("Error updating membership:", err);
                    return res.status(500).json({ error: "Failed to update membership", success: false });
                });
            }

            // Insert into transactions table
            const insertTransactionQuery = `
                INSERT INTO transactions (user_id, description, amount, payment_status, payment_date)
                VALUES (?, ?, ?, 'Paid', ?)
            `;
            const insertTransactionValues = [user_id, description || 'Membership Payment', amount, payment_date];

            db.query(insertTransactionQuery, insertTransactionValues, (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        console.error("Error inserting transaction:", err);
                        return res.status(500).json({ error: "Failed to insert transaction", success: false });
                    });
                }

                // Commit transaction
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error("Error committing transaction:", err);
                            return res.status(500).json({ error: "Failed to commit transaction", success: false });
                        });
                    }

                    res.status(200).json({
                        message: "Membership updated and transaction inserted successfully",
                        success: true,
                        endDate: end_date
                    });
                });
            });
        });
    });
});


//TrainerSelection
router.get("/trainers", (req, res) => {
    const query = "SELECT user_id, name, gender,email, profile_picture FROM user WHERE role = 'trainer'";
    
    db.query(query, (err, results) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ error: "Failed to fetch trainers" });
      }
      res.json({ trainers: results });
    });
});
  
// Save selected trainer
router.post("/selectTrainer", (req, res) => {

    const { member_id, trainer_id } = req.body;

    if (!member_id || !trainer_id) {
        return res.status(400).json({ error: "Member ID and Trainer ID are required" });
    }

    const checkQuery = `SELECT * FROM member_trainer WHERE member_id = ?`;

    const query = `INSERT INTO member_trainer (member_id, trainer_id) 
                    VALUES (?, ?) 
                    ON DUPLICATE KEY UPDATE trainer_id = VALUES(trainer_id)`;

    const updateQuery = `UPDATE member_trainer SET trainer_id = ? WHERE member_id = ?`;

    db.query(checkQuery, [member_id], (err, checkResults) => {
        if (err) {
        console.error("Database error:", err); 
        return res.status(500).json({ error: "Failed to assign trainer" });
        }
        if (checkResults.length == 0){
            db.query(query, [member_id, trainer_id], (err, results) => {
                if (err) {
                console.error("Database error:", err); 
                return res.status(500).json({ error: "Failed to assign trainer" });
                }
                res.json({ success: true, message: "Trainer assigned successfully" });
            });
        }else{
            db.query(updateQuery, [trainer_id, member_id], (err, results) => {
                if (err) {
                console.error("Database error:", err); 
                return res.status(500).json({ error: "Failed to assign trainer" });
                }
                res.json({ success: true, message: "Trainer assigned successfully" });
            });
        }
    });
});


module.exports = router;