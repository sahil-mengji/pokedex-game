const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// GET all moves
router.get("/moves", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Move ORDER BY move_id");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching moves:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST a new move
router.post("/moves", async (req, res) => {
  try {
    const { name, type_id, power, accuracy, pp, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const query = `
      INSERT INTO Move (name, type_id, power, accuracy, pp, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [name, type_id, power, accuracy, pp, description]);
    res.status(201).json({ message: "Move added successfully", move_id: result.insertId });
  } catch (error) {
    console.error("Error inserting move:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
