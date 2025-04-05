// register.js
const express = require("express");
const router = express.Router();
const pool = require("./config/trainerdb"); // Import your DB pool
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

router.post('/register', async (req, res) => {
  const { name, email, gender, password } = req.body;

  if (!name || !email || !gender || !password) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  try {
    // Check if a trainer with the given email already exists
    const selectQuery = 'SELECT trainer_id FROM trainers WHERE email = ?';
    const [existingRows] = await pool.query(selectQuery, [email]);
    if (existingRows.length > 0) {
      return res.status(400).json({ success: false, error: 'A trainer with this email already exists. Please log in.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new trainer
    const insertQuery = 'INSERT INTO trainers (name, email, gender, password) VALUES (?, ?, ?, ?)';
    const [insertResults] = await pool.query(insertQuery, [name, email, gender, hashedPassword]);
    const trainerId = insertResults.insertId;

    // Fetch the newly created trainer (excluding password)
    const fetchQuery = 'SELECT trainer_id, name, email, gender, level, created_at FROM trainers WHERE trainer_id = ?';
    const [rows] = await pool.query(fetchQuery, [trainerId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Trainer not found after registration.' });
    }

    // Generate a JWT for the trainer
    const token = jwt.sign({ trainer_id: rows[0].trainer_id }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({ success: true, user: rows[0], token });
  } catch (err) {
    console.error('Error during registration:', err);
    return res.status(500).json({ success: false, error: 'Database error during registration.' });
  }
});

// GET endpoint for trainer count (unchanged)
router.get('/register', async (req, res) => {
  try {
    const countQuery = 'SELECT COUNT(*) AS count FROM trainers';
    const [rows] = await pool.query(countQuery);
    const count = rows[0].count;
    res.status(200).json({ success: true, count });
  } catch (err) {
    console.error('Error retrieving trainer count:', err);
    res.status(500).json({ success: false, error: 'Database error retrieving count.' });
  }
});

module.exports = router;
