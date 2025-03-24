// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const registerRoutes = require("./register");
const loginRoutes = require("./login");
const validateRoutes = require("./validate"); // Import validate routes
const pokemonRoutes = require("./Pokedex");
const pokemonDetailRoutes = require("./PokemonDetailRoutes");
// const gamestarter = require("./games");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Mount auth routes under '/api'
app.use("/api", registerRoutes);
app.use("/api", loginRoutes);
app.use("/api", validateRoutes);

app.use("/pokemon", pokemonRoutes);
app.use("/pokemon-detail", pokemonDetailRoutes);

app.get("/", (req, res) => {
  res.send("Pokémon API is running.");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
