// src/App.js
import React, { useState, useEffect } from "react";
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

	// Connect to socket and handle join if name exists in localStorage
	useEffect(() => {
		const newSocket = io("http://localhost:1000");

		newSocket.on("connect", () => {
			console.log("Connected to server");
			setSocket(newSocket);

			// Auto-join if name exists
			const name = localStorage.getItem("name");
			if (name) {
				const userData = {
					username: name,
					position: { x: Math.random() * 800, y: Math.random() * 600 },
					color: getRandomColor(),
				};
				newSocket.emit("join", userData);
			}
		});

		newSocket.on("disconnect", () => {
			console.log("Disconnected from server");
			setConnected(false);
		});

		return () => {
			newSocket.disconnect();
		};
	}, []);

	// Set up socket event listeners
	useEffect(() => {
		if (!socket) return;

		socket.on("init", (data) => {
			setUsers(data.users);
			setCurrentUser({
				id: data.id,
				...data.users[data.id],
			});
			setConnected(true);
		});

		socket.on("user_joined", (userData) => {
			setUsers((prevUsers) => ({
				...prevUsers,
				[userData.id]: userData,
			}));
		});

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

		socket.on("user_left", (userId) => {
			setUsers((prevUsers) => {
				const newUsers = { ...prevUsers };
				delete newUsers[userId];
				return newUsers;
			});
		});

		socket.on("receive_message", (message) => {
			setMessages((prevMessages) => [...prevMessages, message]);
		});
	}, [socket]);

	// Handle user joining via UserJoin component
	const handleJoin = (username) => {
		if (!socket) return;

		localStorage.setItem("name", username);

		const userData = {
			username,
			position: { x: Math.random() * 800, y: Math.random() * 600 },
			color: getRandomColor(),
		};

		socket.emit("join", userData);
	};

	// Handle movement update
	const handleMove = (newPosition) => {
		if (!socket || !currentUser) return;

		setUsers((prevUsers) => ({
			...prevUsers,
			[currentUser.id]: {
				...prevUsers[currentUser.id],
				position: newPosition,
			},
		}));

		socket.emit("move", newPosition);
	};

	// Handle chat messages
	const handleSendMessage = (message) => {
		if (!socket || !currentUser || !message.trim()) return;

		socket.emit("send_message", message);
	};

	// Random color generator
	const getRandomColor = () => {
		const letters = "0123456789ABCDEF";
		let color = "#";
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	};

	return (
		<div className="">
			{!connected ? (
				<UserJoin onJoin={handleJoin} />
			) : (
				<div className="flex h-[calc(100vh-80px)] bg-red-300">
					<Ground
						users={users}
						onSendMessage={handleSendMessage}
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
