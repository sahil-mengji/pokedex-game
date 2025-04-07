// validate.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const pool = require("./config/trainerdb"); // Your database pool

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

router.get("/validate", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ success: false, error: "No token provided" });
  }
  
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }
    
    try {
      const query = "SELECT trainer_id, name, email, gender, level, created_at FROM trainers WHERE trainer_id = ?";
      const [rows] = await pool.query(query, [decoded.trainer_id]);
      
      if (rows.length === 0) {
        return res.status(404).json({ success: false, error: "User not found" });
      }
      
      // Fetch the trainer's Pokémon
      const [pokemonRows] = await pool.query("SELECT * FROM trainer_pokemon WHERE trainer_id = ?", [decoded.trainer_id]);
      
      let userData = rows[0];
      
      if (pokemonRows.length > 0) {
        userData.starterChosen = true;
        userData.starter = pokemonRows[0].nickname; // or however you want to identify it
        userData.pokemons = pokemonRows;
      } else {
        userData.starterChosen = false;
        userData.starter = null;
        userData.pokemons = [];
      }
      
      return res.json({ success: true, user: userData });
    } catch (error) {
      console.error("Error during validation:", error);
      return res.status(500).json({ success: false, error: "Server error during validation" });
    }
  });
});

module.exports = router;
