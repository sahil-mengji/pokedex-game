// Pokedex.js
const express = require("express");
const router = express.Router();
const db = require("./config/db"); // Ensure this is a promise-based pool from mysql2

// GET /pokemon
// Returns a list of Pokémon with their id, name, img_src, and types (as an array)
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
        p.pokemon_id, 
        p.name,  
        p.img_src, 
        GROUP_CONCAT(t.name) AS types 
      FROM Pokemon p
      LEFT JOIN Pokemon_Type pt ON p.pokemon_id = pt.pokemon_id
      LEFT JOIN Type t ON pt.type_id = t.type_id
      GROUP BY p.pokemon_id
    `;
    
    // Await the query result using async/await (no callback)
    const [results] = await db.query(query);

    // Convert the concatenated `types` string to an array
    const formattedResults = results.map((pokemon) => ({
      ...pokemon,
      types: pokemon.types ? pokemon.types.split(",") : [],
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
