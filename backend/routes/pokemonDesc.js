// routes/PokemonSpeciesRoute.js
const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Your DB connection pool

// POST /pokemon-species/bulk
// Expects an array of objects with the structure:
// {
//   "pokemon_id": 1,
//   "category": "Seed Pokémon",
//   "flavor_text": "A strange seed was planted on its back...",
//   "genders": ["Male", "Female"]
// }
router.post("/bulk", async (req, res) => {
  const speciesArray = req.body;
  if (!Array.isArray(speciesArray) || speciesArray.length === 0) {
    return res.status(400).json({ error: "Invalid data" });
  }
  try {
    for (const species of speciesArray) {
      const { pokemon_id, category, flavor_text, genders } = species;
      
      // Insert or update species details.
      await pool.query(
        `INSERT INTO pokemon_species (pokemon_id, category, flavor_text)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE
           category = VALUES(category),
           flavor_text = VALUES(flavor_text)`,
        [pokemon_id, category, flavor_text]
      );
      
      // For each gender in the array, insert a record if it doesn't exist.
      if (Array.isArray(genders) && genders.length > 0) {
        for (const gender of genders) {
          await pool.query(
            `INSERT IGNORE INTO pokemon_genders (pokemon_id, gender)
             VALUES (?, ?)`,
            [pokemon_id, gender]
          );
        }
      }
    }
    res.status(201).json({ message: "Data inserted/updated successfully!" });
  } catch (error) {
    console.error("Error processing bulk insert:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
