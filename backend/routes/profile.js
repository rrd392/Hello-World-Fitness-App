const express = require('express');
const db = require('../db'); 
const router = express.Router();
const multer = require("multer");

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
    destination: "../../uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

router.post("/uploadImage", upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    res.json({ imageUrl: `https://yourserver.com/uploads/${req.file.filename}` });
});

module.exports = router;