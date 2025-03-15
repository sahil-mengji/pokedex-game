// generatePokemonSpeciesData.js
const axios = require("axios");
const fs = require("fs");

async function generatePokemonSpeciesData() {
  const totalPokemon = 151; // Adjust as needed
  const data = [];

  for (let id = 1; id <= totalPokemon; id++) {
    try {
      const { data: speciesData } = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
      
      // Get first English flavor text and clean it up.
      const flavorEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === "en");
      const flavor_text = flavorEntry ? flavorEntry.flavor_text.replace(/[\n\r\f]/g, " ") : "";
      
      // Get the English genus as the category.
      const genusEntry = speciesData.genera.find(genus => genus.language.name === "en");
      const category = genusEntry ? genusEntry.genus : "";
      
      // Determine genders based on gender_rate.
      let genders = [];
      if (speciesData.gender_rate === -1) {
        genders = ["Genderless"];
      } else if (speciesData.gender_rate === 0) {
        genders = ["Male"];
      } else if (speciesData.gender_rate === 8) {
        genders = ["Female"];
      } else {
        genders = ["Male", "Female"];
      }
      
      data.push({
        pokemon_id: id,
        category,
        flavor_text,
        genders
      });
      
      console.log(`Processed species ${id}`);
    } catch (error) {
      console.error(`Error processing species ${id}: ${error.message}`);
    }
  }

  fs.writeFileSync("pokemon_species.json", JSON.stringify(data, null, 2));
  console.log(`File "pokemon_species.json" created with ${data.length} entries.`);
}

generatePokemonSpeciesData();
