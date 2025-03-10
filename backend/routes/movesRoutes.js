const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Bulk insert route for moves
router.post("/moves/bulk", async (req, res) => {
  try {
    const moves = req.body; // Expect an array of move objects
    if (!Array.isArray(moves) || moves.length === 0) {
      return res.status(400).json({ error: "Invalid moves data" });
    }
    
    // Map each move to an array of values (ignoring move_id because it's auto-increment)
    const values = moves.map(move => [
      move.name,
      move.type_id,
      move.power,
      move.accuracy,
      move.pp,
      move.description
    ]);
    
    // Generate placeholders for each row (e.g., "(?, ?, ?, ?, ?, ?)")
    const placeholders = values.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");
    const query = `
      INSERT INTO Move (name, type_id, power, accuracy, pp, description)
      VALUES ${placeholders}
    `;
    
    // Flatten the values array into a single array for the query
    await pool.query(query, values.flat());
    res.status(201).json({ message: `${moves.length} moves added successfully!` });
  } catch (error) {
    console.error("Error inserting moves:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
