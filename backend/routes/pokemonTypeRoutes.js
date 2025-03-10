// pokemonTypeRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Bulk insert route for Pokemon_Type linking table
router.post("/pokemon_types", async (req, res) => {
  try {
    const links = req.body; // Expecting an array of objects with { pokemon_id, type_id }
    if (!Array.isArray(links) || links.length === 0) {
      return res.status(400).json({ error: "Invalid data" });
    }

    // Prepare values and placeholders dynamically
    const values = links.map(link => [link.pokemon_id, link.type_id]);
    const placeholders = values.map(() => "(?, ?)").join(", ");
    const query = `
      INSERT INTO Pokemon_Type (pokemon_id, type_id)
      VALUES ${placeholders}
    `;
    // Flatten the values array to pass as parameters
    await pool.query(query, values.flat());

    res.status(201).json({ message: `${links.length} linking records added successfully!` });
  } catch (error) {
    console.error("Error inserting linking records:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
