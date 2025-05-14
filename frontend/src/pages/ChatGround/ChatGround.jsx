// CLIENT SIDE (React App)

// First, install the necessary packages:
// npm create react-app client
// cd client
// npm install socket.io-client

// src/App.js
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

import Ground from "./components/Ground";
import ChatBox from "./components/ChatBox";
import UserJoin from "./components/UserJoin";

function ChatGround() {
	const [socket, setSocket] = useState(null);
	const [connected, setConnected] = useState(false);
	const [users, setUsers] = useState({});
	const [currentUser, setCurrentUser] = useState(null);
	const [messages, setMessages] = useState([]);

	// Connect to socket when component mounts
	useEffect(() => {
		// Use empty URL to connect to the same host that serves the page
		const newSocket = io("http://localhost:1000");

		newSocket.on("connect", () => {
			console.log("Connected to server");
			setSocket(newSocket);
		});

		newSocket.on("disconnect", () => {
			console.log("Disconnected from server");
			setConnected(false);
		});

		return () => {
			newSocket.disconnect();
		};
	}, []);

	// Set up event listeners once socket is established
	useEffect(() => {
		if (!socket) return;

		// Handle initialization data
		socket.on("init", (data) => {
			setUsers(data.users);
			setCurrentUser({
				id: data.id,
				...data.users[data.id],
			});
			setConnected(true);
		});

		// Handle new user joining
		socket.on("user_joined", (userData) => {
			setUsers((prevUsers) => ({
				...prevUsers,
				[userData.id]: userData,
			}));
		});

		// Handle user movements
		socket.on("user_moved", (data) => {
			setUsers((prevUsers) => {
				if (!prevUsers[data.id]) return prevUsers;

				return {
					...prevUsers,
					[data.id]: {
						...prevUsers[data.id],
						position: data.position,
					},
				};
			});
		});

		// Handle user leaving
		socket.on("user_left", (userId) => {
			setUsers((prevUsers) => {
				const newUsers = { ...prevUsers };
				delete newUsers[userId];
				return newUsers;
			});
		});

		// Handle receiving messages
		socket.on("receive_message", (message) => {
			setMessages((prevMessages) => [...prevMessages, message]);
		});
	}, [socket]);

	// Handle user joining the ground
	const handleJoin = (username) => {
		if (!socket) return;

		const userData = {
			username,
			position: { x: Math.random() * 800, y: Math.random() * 600 },
			color: getRandomColor(),
		};

		socket.emit("join", userData);
	};

	// Handle user movement
	const handleMove = (newPosition) => {
		if (!socket || !currentUser) return;

		// Update local state
		setUsers((prevUsers) => ({
			...prevUsers,
			[currentUser.id]: {
				...prevUsers[currentUser.id],
				position: newPosition,
			},
		}));

		// Emit movement to server
		socket.emit("move", newPosition);
	};

	// Handle sending chat messages
	const handleSendMessage = (message) => {
		if (!socket || !currentUser || !message.trim()) return;

		socket.emit("send_message", message);
	};

	// Helper function for random color
	const getRandomColor = () => {
		const letters = "0123456789ABCDEF";
		let color = "#";
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	};

	return (
		<div className="app">
			<h1>Digital Ground</h1>

			{!connected ? (
				<UserJoin onJoin={handleJoin} />
			) : (
				<div
					className="main-content flex"
					style={{ marginInline: "30px", gap: "20px" }}
				>
					<Ground
						users={users}
						currentUser={currentUser}
						onMove={handleMove}
						vicinityDistance={100}
					/>
					<ChatBox
						messages={messages}
						onSendMessage={handleSendMessage}
						currentUserId={currentUser?.id}
					/>
				</div>
			)}
		</div>
	);
}

export default ChatGround;
