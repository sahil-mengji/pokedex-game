const axios = require("axios");
const fs = require("fs");

// Mapping from move type names to type IDs (adjust as per your Type table)
const typeMapping = {
  normal: 1,
  fire: 2,
  water: 3,
  grass: 4,
  electric: 5,
  ice: 6,
  fighting: 7,
  poison: 8,
  ground: 9,
  flying: 10,
  psychic: 11,
  bug: 12,
  rock: 13,
  ghost: 14,
  dragon: 15,
  dark: 16,
  steel: 17,
  fairy: 18,
};

async function fetchMoveDetails(moveUrl) {
  try {
    const res = await axios.get(moveUrl);
    const data = res.data;
    
    // Get the move's name and id from the API
    const moveId = data.id;
    const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);

    // Get type: data.type is an object with a "name" property.
    const moveTypeName = data.type ? data.type.name : "normal";
    const type_id = typeMapping[moveTypeName] || 1;  // default to 1 if missing

    // power, accuracy, pp may be null
    const power = data.power;
    const accuracy = data.accuracy;
    const pp = data.pp;

    // Get description from effect_entries array – pick first English entry
    let description = "";
    if (data.effect_entries && data.effect_entries.length > 0) {
      const enEntry = data.effect_entries.find(entry => entry.language.name === "en");
      description = enEntry ? enEntry.short_effect || enEntry.effect : "";
    }

    return {
      move_id: moveId,
      name,
      type_id,
      power,
      accuracy,
      pp,
      description,
    };
  } catch (error) {
    console.error(`Error fetching move details from ${moveUrl}:`, error.message);
    return null;
  }
}

async function fetchMoves() {
  const limit = 165; // Number of moves to fetch
  let moves = [];

  try {
    // Get the list of moves from the API
    const res = await axios.get(`https://pokeapi.co/api/v2/move?limit=${limit}`);
    const moveList = res.data.results;

    // Loop through the list and fetch details for each move
    for (let move of moveList) {
      const moveDetails = await fetchMoveDetails(move.url);
      if (moveDetails) {
        moves.push(moveDetails);
        console.log(`Fetched move: ${moveDetails.name}`);
      }
    }

    // Save moves to moves.json file
    fs.writeFileSync("moves.json", JSON.stringify(moves, null, 2));
    console.log("Moves data saved to moves.json!");
  } catch (error) {
    console.error("Error fetching moves:", error.message);
  }
}

fetchMoves();
