// games.js
const express = require('express');
const router = express.Router();
const starterStats = require('./starterStats');
const trainerDb = require('./config/trainerdb'); // MySQL connection/pool for the trainer database

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

    // Check if the trainer already has a starter Pokémon (position = 1)
    const [rows] = await trainerDb.query(
      'SELECT COUNT(*) as count FROM trainer_pokemon WHERE trainer_id = ?',
      [trainerId]
    );
    if (rows[0].count > 0) {
      return res.status(400).json({ error: 'Trainer already has a Pokémon' });
    }

    // Get the starter stats from the imported starterStats file
    const s = starterStats[chosenPokemon];

    // Insert the chosen starter into the trainer_pokemon table.
    // Position 1 indicates this is the starter.
    const insertPokemonQuery = `
      INSERT INTO trainer_pokemon
        (trainer_id, pokemon_id, nickname, level, current_hp, max_hp, 
         attack, defense, speed, special_atk, special_def, experience, status, position)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
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

    const [result] = await trainerDb.query(insertPokemonQuery, insertParams);
    // Get the auto-generated trainer_pokemon id to link moves with this record.
    const trainerPokemonId = result.insertId;

    // Insert the moves for this starter into trainer_pokemon_moves.
    // The trainer_pokemon_moves table only needs the trainer_pokemon_id, move_id, and current_pp.
    if (s.moves && s.moves.length > 0) {
      for (const move of s.moves) {
        const insertMoveQuery = `
          INSERT INTO trainer_pokemon_moves
            (trainer_pokemon_id, move_id, current_pp)
          VALUES (?, ?, ?)
        `;
        // We use move.pp as the default current_pp.
        const defaultPP = move.pp || 0;
        await trainerDb.query(insertMoveQuery, [trainerPokemonId, move.move_id, defaultPP]);
      }
    }

    res.json({ message: 'Starter chosen successfully', chosenPokemon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to choose starter' });
  }
});

module.exports = router;
