const axios = require("axios");
const fs = require("fs");

// Helper: Extract numeric ID from a URL.
function extractIdFromUrl(url) {
  const parts = url.split("/").filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
}

// Fetch moves for a given Pokémon, filtering for moves learned via level-up.
// We assume that TM moves have level_learned set to 0.
async function fetchPokemonMoves(pokemonId) {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = response.data;
    let movesList = [];
    let seen = new Set();
    
    for (const moveEntry of data.moves) {
      // Filter for moves learned in the "firered-leafgreen" version group.
      const details = moveEntry.version_group_details.find(
        vg => vg.version_group.name === "firered-leafgreen"
      );
      if (details) {
        const levelLearned = details.level_learned_at;
        // Only include moves learned by leveling up (level > 0)
        if (levelLearned > 0) {
          const moveId = extractIdFromUrl(moveEntry.move.url);
          // Also, ensure we only insert one record per move for this Pokémon.
          if (!seen.has(moveId) && moveId <= 400) {
            seen.add(moveId);
            movesList.push({
              pokemon_id: pokemonId,
              move_id: moveId,
              level_learned: levelLearned
            });
          }
        }
      }
    }
    return movesList;
  } catch (error) {
    console.error(`Error fetching moves for Pokémon #${pokemonId}: ${error.message}`);
    return [];
  }
}

async function generatePokemonMovesJSON() {
  let allMoves = [];
  for (let id = 76; id <= 151; id++) {
    const moves = await fetchPokemonMoves(id);
    allMoves = allMoves.concat(moves);
    console.log(`Processed Pokémon #${id}, found ${moves.length} unique level-up moves.`);
  }
  fs.writeFileSync("pokemon_moves_76_151.json", JSON.stringify(allMoves, null, 2));
  console.log(`pokemon_moves_76_151.json generated with ${allMoves.length} records.`);
}

generatePokemonMovesJSON();
