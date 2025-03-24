// games.js
const express = require('express');
const router = express.Router();
const starterStats = require('./starterStats');
const db = require('./config/trainerdb'); // your MySQL connection

// POST /api/choose-starter
router.post('/choose-starter', async (req, res) => {
  try {
    const { trainerId, chosenPokemon } = req.body;
    if (!trainerId || !chosenPokemon) {
      return res.status(400).json({ error: 'Missing trainerId or chosenPokemon' });
    }
    if (!starterStats[chosenPokemon]) {
      return res.status(400).json({ error: 'Invalid starter choice' });
    }

    // Check if trainer already has a Pokémon (starter)
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM trainer_pokemon WHERE trainer_id = ?',
      [trainerId]
    );
    if (rows[0].count > 0) {
      return res.status(400).json({ error: 'Trainer already has a Pokémon' });
    }

    const s = starterStats[chosenPokemon];
    const insertQuery = `
      INSERT INTO trainer_pokemon
        (trainer_id, pokemon_id, nickname, level, current_hp, max_hp, 
         attack, defense, speed, special_atk, special_def, experience, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const insertParams = [
      trainerId,
      s.pokemon_id,
      s.nickname,
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
    res.json({ message: 'Starter chosen successfully', chosenPokemon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to choose starter' });
  }
});

module.exports = router;
