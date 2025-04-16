	// server.js
	const express = require("express");
	const bodyParser = require("body-parser");
	const cors = require("cors");

	// const registerRoutes = require("./src/register");
	// const loginRoutes = require("./src/login");
	// const validateRoutes = require("./src/validate");
	// const pokemonRoutes = require("./src/Pokedex");
	// const pokemonDetailRoutes = require("./src/PokemonDetailRoutes");
	// const gamestarter = require("./src/games");
	// const trainerRouter = require("./src/trainer");

	const app = express();
	const PORT = process.env.PORT || 5000;

	app.use(cors());
	app.use(bodyParser.json());

	// app.use("/api", registerRoutes);
	// app.use("/api", loginRoutes);
	// app.use("/api", validateRoutes);
	// app.use("/api", gamestarter);

	// app.use("/pokemon", pokemonRoutes);
	// app.use("/pokemon-detail", pokemonDetailRoutes);

	// app.use("/trainer", trainerRouter);
	// app.get("/", (req, res) => {
	// 	res.send("Pokémon API is running.");
	// });

	app.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});

	// SERVER SETUP (server.js)

	const http = require("http");
	const socketIo = require("socket.io");
	const path = require("path");

	const server = http.createServer(app);
	const io = socketIo(server, {
		cors: {
			origin: "*", // or specify your frontend domain
			methods: ["GET", "POST"],
		},
	});

	// Store connected users
	const users = {};

	// Vicinity distance for chat (in virtual units)
	const CHAT_VICINITY_DISTANCE = 100;

	// Socket.IO connection handling
	io.on("connection", (socket) => {
		console.log("New user connected:", socket.id);

		// Handle user joining
		socket.on("join", (userData) => {
			// Add user to the users object with initial position
			users[socket.id] = {
				id: socket.id,
				username: userData.username,
				position: userData.position || {
					x: Math.random() * 800,
					y: Math.random() * 600,
				},
				color: userData.color || getRandomColor(),
			};

			// Send the current user their ID and initial state
			socket.emit("init", {
				id: socket.id,
				users: users,
			});

			// Broadcast new user to everyone else
			socket.broadcast.emit("user_joined", users[socket.id]);
		});

		// Handle user movement
		socket.on("move", (position) => {
			if (users[socket.id]) {
				users[socket.id].position = position;

				// Broadcast user's new position to all other clients
				socket.broadcast.emit("user_moved", {
					id: socket.id,
					position,
				});
			}
		});

		// Handle chat messages
		socket.on("send_message", (message) => {
			if (!users[socket.id]) return;

			const sender = users[socket.id];

			// Find users in vicinity
			const usersInVicinity = Object.values(users).filter((user) => {
				if (user.id === sender.id) return false;

				// Calculate distance
				const dx = user.position.x - sender.position.x;
				const dy = user.position.y - sender.position.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				return distance <= CHAT_VICINITY_DISTANCE;
			});

			// Send message only to users in vicinity (and the sender)
			const messageData = {
				id: Date.now(),
				sender: sender.id,
				senderName: sender.username,
				text: message,
				timestamp: new Date().toISOString(),
			};

			socket.emit("receive_message", messageData);

			usersInVicinity.forEach((user) => {
				io.to(user.id).emit("receive_message", messageData);
			});
		});

		// Handle disconnection
		socket.on("disconnect", () => {
			console.log("User disconnected:", socket.id);

			if (users[socket.id]) {
				// Broadcast to all clients that this user has left
				io.emit("user_left", socket.id);

				// Remove user from the users object
				delete users[socket.id];
			}
		});
	});

	// Helper function for random color
	function getRandomColor() {
		const colors = [
			"#FF6633",
			"#FFB399",
			"#FF33FF",
			"#FFFF99",
			"#00B3E6",
			"#E6B333",
			"#3366E6",
			"#999966",
			"#99FF99",
			"#B34D4D",
		];
		return colors[Math.floor(Math.random() * colors.length)];
	}

	server.listen(1000, () => {
		console.log(`Server with Socket.IO is running on http://localhost:${PORT}`);
	});
