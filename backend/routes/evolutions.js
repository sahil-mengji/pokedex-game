// evolutionRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Adjust the path as needed

// Bulk insert route for Evolution table
router.post("/evolutions", async (req, res) => {
  try {
    const evolutions = req.body; // Expecting an array of evolution objects

    if (!Array.isArray(evolutions) || evolutions.length === 0) {
      return res.status(400).json({ error: "Invalid evolution data" });
    }

    // Prepare values and placeholders dynamically
    const values = evolutions.map(evo => [
      evo.base_pokemon_id,
      evo.evolved_pokemon_id,
      evo.evolution_method,
      evo.evolution_condition
    ]);

    const placeholders = values.map(() => "(?, ?, ?, ?)").join(", ");
    const query = `
      INSERT INTO Evolution (base_pokemon_id, evolved_pokemon_id, evolution_method, evolution_condition)
      VALUES ${placeholders}
    `;
    // Flatten the values array
    await pool.query(query, values.flat());

    res.status(201).json({ message: `${evolutions.length} evolution records added successfully!` });
  } catch (error) {
    console.error("Error inserting evolution data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
