const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// GET all abilities
router.get("/abilities", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Ability ORDER BY ability_id");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching abilities:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST a single ability
router.post("/abilities", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const query = `
      INSERT INTO Ability (name, description)
      VALUES (?, ?)
    `;
    const [result] = await pool.query(query, [name, description]);
    res.status(201).json({ message: "Ability added successfully", ability_id: result.insertId });
  } catch (error) {
    console.error("Error inserting ability:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Bulk insert route for abilities
router.post("/abilities/bulk", async (req, res) => {
  try {
    const abilities = req.body; // Expecting an array of ability objects
    if (!Array.isArray(abilities) || abilities.length === 0) {
      return res.status(400).json({ error: "Invalid abilities data" });
    }
    const values = abilities.map(ability => [ability.name, ability.description]);
    const placeholders = values.map(() => "(?, ?)").join(", ");
    const query = `
      INSERT INTO Ability (name, description)
      VALUES ${placeholders}
    `;
    await pool.query(query, values.flat());
    res.status(201).json({ message: `${abilities.length} abilities added successfully!` });
  } catch (error) {
    console.error("Error inserting abilities:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
