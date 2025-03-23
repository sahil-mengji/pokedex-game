// login.js
const express = require("express");
const router = express.Router();
const pool = require("./config/trainerdb"); // Import your DB pool
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  try {
    const selectQuery = 'SELECT trainer_id, name, email, gender, level, created_at, password FROM trainers WHERE email = ?';
    const [rows] = await pool.query(selectQuery, [email]);
    if (rows.length === 0) {
      return res.status(400).json({ success: false, error: 'Trainer not found.' });
    }

    const trainer = rows[0];
    const isMatch = await bcrypt.compare(password, trainer.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Incorrect password.' });
    }

    // Remove password before sending response
    delete trainer.password;

    const token = jwt.sign({ trainer_id: trainer.trainer_id }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ success: true, user: trainer, token });
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ success: false, error: 'Server error during login.' });
  }
});

module.exports = router;
