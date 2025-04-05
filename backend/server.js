// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const registerRoutes = require("./src/register");
const loginRoutes = require("./src/login");
const validateRoutes = require("./src/validate");
const pokemonRoutes = require("./src/Pokedex");
const pokemonDetailRoutes = require("./src/PokemonDetailRoutes");
const gamestarter = require("./src/games");
const trainerRouter = require('./src/trainer');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api", registerRoutes);
app.use("/api", loginRoutes);
app.use("/api", validateRoutes);
app.use("/api", gamestarter);

app.use("/pokemon", pokemonRoutes);
app.use("/pokemon-detail", pokemonDetailRoutes);

app.use('/trainer', trainerRouter);
app.get("/", (req, res) => {
  res.send("Pokémon API is running.");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
