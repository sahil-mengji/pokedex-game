// trainerData.js
const express = require('express');
const router = express.Router();
const db = require('./config/db');               // Connection/pool for the pokedex database
const trainer_db = require('./config/trainerdb'); // Connection/pool for the trainer database

// GET /trainer/:trainerId/data
// Returns trainer info along with all their Pokémon (including moves and types)
router.get('/:trainerId/data', async (req, res) => {
  const trainerId = req.params.trainerId;

  try {
    // Retrieve trainer information.
    const [trainerRows] = await trainer_db.query(
      'SELECT * FROM trainers WHERE trainer_id = ?',
      [trainerId]
    );
    if (trainerRows.length === 0) {
      return res.status(404).json({ error: 'Trainer not found' });
    }
    const trainer = trainerRows[0];

    // Retrieve all Pokémon for the trainer.
    const [pokemonRows] = await trainer_db.query(
      'SELECT * FROM trainer_pokemon WHERE trainer_id = ?',
      [trainerId]
    );

    // For each Pokémon, get its moves and types.
    const pokemonWithDetails = await Promise.all(pokemonRows.map(async (p) => {
      // Moves: Join trainer_pokemon_moves with Move and then with Type (for move_type name).
      const moveQuery = `
        SELECT 
          tpm.move_id,
          tpm.current_pp,
          m.name AS move_name,
          m.power,
          m.accuracy,
          m.pp AS base_pp,
          t.name AS move_type,  -- Get move type name from Type table
          NULL AS status_effect,
          NULL AS effect_chance
        FROM trainer_pokemon_moves tpm
        LEFT JOIN pokedex.\`Move\` m ON tpm.move_id = m.move_id
        LEFT JOIN \`pokedex\`.\`Type\` t ON m.type_id = t.type_id
        WHERE tpm.trainer_pokemon_id = ?
      `;
      const [moveRows] = await trainer_db.query(moveQuery, [p.id]);
      const moves = moveRows.map(row => ({
        move_id: row.move_id,
        name: row.move_name,
        power: row.power,
        accuracy: row.accuracy ? row.accuracy / 100 : null,
        move_type: row.move_type,
        status_effect: row.status_effect,
        effect_chance: row.effect_chance
      }));

      // Types: Join Pokemon_Type with Type to get type names.
      const typeQuery = `
        SELECT t.name AS type_name
        FROM \`pokedex\`.\`Pokemon_Type\` pt
        JOIN \`pokedex\`.\`Type\` t ON pt.type_id = t.type_id
        WHERE pt.pokemon_id = ?
      `;
      const [typeRows] = await trainer_db.query(typeQuery, [p.pokemon_id]);
      const types = typeRows.map(r => r.type_name);

      return {
        pokemon_id: p.pokemon_id,
        nickname: p.nickname,
        level: p.level,
        max_hp: p.max_hp,
        current_hp: p.current_hp,
        attack: p.attack,
        defense: p.defense,
        speed: p.speed,
        special_atk: p.special_atk,
        special_def: p.special_def,
        status: p.status,
        types,  // Array of type names (e.g., ["Normal"])
        moves  // Array of move objects as defined above
      };
    }));

    // Build the final JSON structure.
    const output = {
      trainer_id: trainer.trainer_id,
      name: trainer.name,
      pokemon: pokemonWithDetails
    };

    return res.json(output);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
