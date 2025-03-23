const express = require('express');
const router = express.Router();
const starterStats = require('../starterStats'); // the file from above

// Example: Using mysql2 or mysql package
const db = require('../database'); // your DB connection

// POST /game/choose-starter
router.post('/choose-starter', async (req, res) => {
  try {
    // We expect the request body to contain trainerId and chosenPokemon
    // chosenPokemon should be one of: 'mankey', 'sandshrew', 'growlithe'
    const { trainerId, chosenPokemon } = req.body;

    // 1. Validate input
    if (!trainerId || !chosenPokemon) {
      return res.status(400).json({ error: 'Missing trainerId or chosenPokemon' });
    }
    if (!starterStats[chosenPokemon]) {
      return res.status(400).json({ error: 'Invalid starter choice' });
    }

    // 2. Check if trainer already has a starter (optional check)
    // You might want to prevent them from picking more than once:
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM trainer_pokemon WHERE trainer_id = ?',
      [trainerId]
    );
    if (rows[0].count > 0) {
      return res.status(400).json({ error: 'Trainer already has a Pokémon' });
    }

    // 3. Prepare the stats from our dictionary
    const s = starterStats[chosenPokemon];

    // 4. Insert into trainer_pokemon
    // Make sure you insert the columns that exist in your table
    const insertQuery = `
      INSERT INTO trainer_pokemon
        (trainer_id, pokemon_id, nickname, level, current_hp, max_hp, 
         attack, defense, speed, special_atk, special_def, experience, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const insertParams = [
      trainerId,
      s.pokemon_id,
      s.nickname,   // or you can let user pick a nickname
      s.level,
      s.current_hp,
      s.max_hp,
      s.attack,
      s.defense,
      s.speed,
      s.special_atk,
      s.special_def,
      s.experience,
      s.status
    ];

    await db.query(insertQuery, insertParams);

    // 5. Return success
    res.json({ message: 'Starter chosen successfully', chosenPokemon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to choose starter' });
  }
});

module.exports = router;
