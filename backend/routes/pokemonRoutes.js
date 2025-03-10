const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Import the database connection

// Route to get all Pokémon
router.get("/pokemons", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM Pokemon");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching Pokémon:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Bulk insert route for Pokémon (without type_id)
router.post("/pokemons", async (req, res) => {
    try {
        const pokemons = req.body; // Expecting an array of Pokémon objects
        if (!Array.isArray(pokemons) || pokemons.length === 0) {
            return res.status(400).json({ error: "Invalid Pokémon data" });
        }
        
        // For each Pokémon, create an array of values in the order of the table columns:
        // name, species, height, weight, base_experience, hp, attack, defense, special_attack, special_defense, speed, img_src
        const values = pokemons.map(pkm => [
            pkm.name,
            pkm.species || null,
            pkm.height,
            pkm.weight,
            pkm.base_experience || null,
            pkm.hp,
            pkm.attack,
            pkm.defense,
            pkm.special_attack,
            pkm.special_defense,
            pkm.speed,
            pkm.img_src
        ]);

        // Create a placeholder for each row
        const placeholders = values.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").join(", ");
        // Flatten the array of values
        const flattenedValues = values.flat();

        const query = `
            INSERT INTO Pokemon (name, species, height, weight, base_experience, hp, attack, defense, special_attack, special_defense, speed, img_src)
            VALUES ${placeholders}
        `;

        await pool.query(query, flattenedValues);
        res.status(201).json({ message: `${pokemons.length} Pokémon added successfully!` });
    } catch (error) {
        console.error("Error inserting Pokémon:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
