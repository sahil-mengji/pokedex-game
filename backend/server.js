const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Import routes from different modules
const pokemonRoutes = require("./routes/pokemonRoutes");
const evolutionRoutes = require("./routes/evolutions");
const movesRoutes = require("./routes/movesRoutes");

// Mount routes under "/api"
app.use("/api", pokemonRoutes);
app.use("/api", evolutionRoutes);
app.use("/api", movesRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
