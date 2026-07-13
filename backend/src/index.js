const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
dotenv.config();
const User = require("./database/userModel.js");
const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Mount API routes
const pokemonRoutes = require("./routes/pokemonRoutes");
const evolutionRoutes = require("./routes/evolutionRoutes");
const movesRoutes = require("./routes/movesRoutes");
const abilityRoutes = require("./routes/abilityRoutes");
const damageRoutes = require("./routes/damageRoutes");
const pokemonTypeRoutes = require("./routes/pokemonTypeRoutes");
const pokemonDescRoutes = require("./routes/pokemonDesc");
const pokemonMoveRoutes = require("./routes/pokemon_move");
const pokemonAbilityRoutes = require("./routes/pokemon_abilities");

app.use("/api", pokemonRoutes);
app.use("/api", evolutionRoutes);
app.use("/api", movesRoutes);
app.use("/api", abilityRoutes);
app.use("/api", damageRoutes);
app.use("/api", pokemonTypeRoutes);
app.use("/api", pokemonDescRoutes);
app.use("/api", pokemonMoveRoutes);
app.use("/api", pokemonAbilityRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running at port ${process.env.PORT}`);
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.create(name, email, password);
        console.log(user);
        res.status(201).json({
            status: "success",
            data: user,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
