const pokemonRoutes = require("../routes/pokemonRoutes");
const evolutionRoutes = require("../routes/evolutionRoutes");
const movesRoutes = require("../routes/movesRoutes");

// Mount routes under "/api"
app.use("/api", pokemonRoutes);
app.use("/api", evolutionRoutes);
app.use("/api", movesRoutes);