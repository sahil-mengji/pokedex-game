const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Import your route files
const pokemonRoutes = require("./routes/pokemonRoutes");
// const evolutionRoutes = require("./routes/evolutionRoutes");
const movesRoutes = require("./routes/movesRoutes");
const abilityRoutes = require("./routes/abilityRoutes");
// const pokemonAbilityRoutes = require("./routes/pokemonAbilityRoutes");
const pokemonMoveRoutes = require("./routes/pokemon_move");

// Mount routes under "/api"
app.use("/api", pokemonRoutes);
// app.use("/api", evolutionRoutes);
app.use("/api", movesRoutes);
app.use("/api", abilityRoutes);
// app.use("/api", pokemonAbilityRoutes);
app.use("/api", pokemonMoveRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
