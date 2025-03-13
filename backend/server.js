const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",  // Change from "localhost" to "mysql"
  user: "myuser", // Change from "root" to "myuser"
  password: "mypassword", // Update password
  database: "pokedex",
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL Database!");
});

app.get("/", (req, res) => {
  res.send("Pokédex API is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/pokemon", async (req, res) => {
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

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching Pokémon:", err);
        return res.status(500).json({ error: "Database query failed" });
      }

      // Convert `types` string to an array
      const formattedResults = results.map((pokemon) => ({
        ...pokemon,
        types: pokemon.types ? pokemon.types.split(",") : [], // Convert to array if not null
      }));

      res.json(formattedResults);
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

