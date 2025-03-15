const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Use the same pool connection as `evolutionRoutes.js`

// Bulk insert route for damage relations
router.get("/damage", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM type_damage_relations");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error retrieving damage relations:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});
module.exports = router;
