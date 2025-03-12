const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Adjust path if needed

// Bulk insert route for Pokemon_Ability linking table using new JSON format
// Expected JSON format: an array of objects, each with a "pokemon_id" and an "abilities" array.
router.post("/pokemon_abilities/bulk", async (req, res) => {
  try {
    const records = req.body; // Array of objects
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const rows = [];
    records.forEach(record => {
      if (record.pokemon_id != null && Array.isArray(record.abilities)) {
        record.abilities.forEach(ability => {
          // Check if ability_id exists and is not null
          if (ability.ability_id != null) {
            // Use ability.is_hidden if defined; otherwise default to 0.
            rows.push([record.pokemon_id, ability.ability_id, ability.is_hidden ? ability.is_hidden : 0]);
          } else {
            console.warn(`Skipping record for pokemon_id ${record.pokemon_id} due to missing ability_id.`);
          }
        });
      }
    });

    if (rows.length === 0) {
      return res.status(400).json({ error: "No valid ability records found" });
    }

    const placeholders = rows.map(() => "(?, ?, ?)").join(", ");
    const query = `
      INSERT INTO Pokemon_Ability (pokemon_id, ability_id, is_hidden)
      VALUES ${placeholders}
    `;
    const flattenedValues = rows.flat();
    await pool.query(query, flattenedValues);
    res.status(201).json({ message: `${rows.length} linking records added successfully!` });
  } catch (error) {
    console.error("Error inserting Pokemon_Ability records:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
