// validate.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const pool = require("./config/trainerdb"); // Your database pool

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

router.get("/validate", async (req, res) => {
  // Get token from the Authorization header (format: Bearer <token>)
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ success: false, error: "No token provided" });
  }
  
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }
    
    try {
      // Check if the trainer exists in the database
      const query =
        "SELECT trainer_id, name, email, gender, level, created_at FROM trainers WHERE trainer_id = ?";
      const [rows] = await pool.query(query, [decoded.trainer_id]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, error: "User not found" });
      }
      return res.json({ success: true, user: rows[0] });
    } catch (error) {
      console.error("Error during validation:", error);
      return res.status(500).json({ success: false, error: "Server error during validation" });
    }
  });
});

module.exports = router;
