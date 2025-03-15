const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pokemonRoutes = require("./Pokedex");
const pokemonDetailRoutes = require("./PokemonDetailRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Mount the GET endpoint at /pokemon
app.use("/pokemon", pokemonRoutes);
app.use("/pokemon-detail", pokemonDetailRoutes);

app.get("/", (req, res) => {
  res.send("Pokémon API is running.");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});





