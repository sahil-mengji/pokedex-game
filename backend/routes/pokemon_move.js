// routes/pokemonMoveRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Adjust path as needed

// Bulk insert route for Pokemon_Move linking table
router.post("/pokemon_moves/bulk", async (req, res) => {
  try {
    const moves = req.body; // Expect an array of objects: { pokemon_id, move_id, level_learned }
    if (!Array.isArray(moves) || moves.length === 0) {
      return res.status(400).json({ error: "Invalid moves data" });
    }
    
    // Map each move object to an array of values
    const values = moves.map(item => [
      item.pokemon_id,
      item.move_id,
      item.level_learned || null
    ]);
    
    // Create placeholders for each row: "(?, ?, ?)"
    const placeholders = values.map(() => "(?, ?, ?)").join(", ");
    const query = `
      INSERT INTO Pokemon_Move (pokemon_id, move_id, level_learned)
      VALUES ${placeholders}
    `;
    const flattenedValues = values.flat();
    await pool.query(query, flattenedValues);
    res.status(201).json({ message: `${moves.length} move records added successfully!` });
  } catch (error) {
    console.error("Error inserting Pokemon_Move records:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
