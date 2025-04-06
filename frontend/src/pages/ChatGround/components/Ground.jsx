import React, { useRef, useEffect, useState } from "react";

const Ground = ({
	users,
	currentUser,
	onMove,
	vicinityDistance,
	onSendMessage,
}) => {
	const groundRef = useRef(null);
	const [messages, setMessages] = useState({});

	// Handle click on ground to move
	const handleClick = (e) => {
		if (!groundRef.current || !currentUser) return;

		const rect = groundRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		onMove({ x, y });
	};

	// Handle keyboard movement with fixed arrow controls
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (!currentUser) return;

			const STEP = 100;
			const { x, y } = currentUser.position;
			let newX = x;
			let newY = y;

			// Fixed key handling
			switch (e.key) {
				case "ArrowUp":
					newY = newY - STEP;
					e.preventDefault();
					break;
				case "ArrowDown":
					newY = newY + STEP;
					e.preventDefault();
					break;
				case "ArrowLeft":
					newX = newX - STEP;
					e.preventDefault();
					break;
				case "ArrowRight":
					newX = newX + STEP;
					e.preventDefault();
					break;
				default:
					return; // Don't handle other keys
			}

			// Only call onMove if position actually changed
			if (newX !== x || newY !== y) {
				onMove({ x: newX, y: newY });
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [currentUser, onMove]);

	// Process incoming chat messages (this would connect to your chat system)
	useEffect(() => {
		// This is a mock of receiving messages from a chat system
		// In a real app, this would connect to your existing chat functionality
		const mockChatReceiver = (userId, message) => {
			if (!userId || !message) return;

			setMessages((prev) => ({
				...prev,
				[userId]: {
					text: message,
					timestamp: Date.now(),
				},
			}));

			// Messages disappear after 5 seconds
			setTimeout(() => {
				setMessages((prev) => {
					const newMessages = { ...prev };
					delete newMessages[userId];
					return newMessages;
				});
			}, 5000);
		};

		// Mock hook up to chat system
		// Replace this with actual connection to your chat system
		if (window.chatSystem) {
			window.chatSystem.onMessage = mockChatReceiver;
		} else {
			window.chatSystem = {
				onMessage: mockChatReceiver,
			};
		}

		// Demo test message on spacebar press
		const handleKeyPress = (e) => {
			if (e.key === " " && currentUser) {
				mockChatReceiver(currentUser.id, "Hello Pokémon world!");
				e.preventDefault();
			}
		};

		window.addEventListener("keypress", handleKeyPress);
		return () => window.removeEventListener("keypress", handleKeyPress);
	}, [currentUser]);

	// Get Pokémon trainer sprite based on user ID
	const getPokemonTrainer = (userId) => {
		// Map user ID to one of 8 trainer types
		const trainerTypes = [
			"red",
			"blue",
			"may",
			"brendan",
			"dawn",
			"lucas",
			"hilda",
			"hilbert",
		];

		// Use user.id to deterministically select a trainer type
		const hash = userId
			.split("")
			.reduce((acc, char) => acc + char.charCodeAt(0), 0);
		const trainerIndex = hash % trainerTypes.length;
		return trainerTypes[trainerIndex];
	};

	return (
		<div
			className="pokemon-ground"
			ref={groundRef}
			onClick={handleClick}
			style={{
				position: "relative",
				width: "800px",
				flexGrow: 1,
				height: "600px",
				backgroundColor: "#7BC95F",
				backgroundImage:
					'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="M0,0 L20,0 L20,20 L0,20 Z" fill="%238ED269" /><path d="M50,50 L70,50 L70,70 L50,70 Z" fill="%238ED269" /></svg>\')',
				border: "4px solid #4E7943",
				borderRadius: "12px",
				overflow: "hidden",
				boxShadow: "inset 0 0 20px rgba(0,0,0,0.2)",
			}}
		>
			{/* Decorative elements */}
			<div className="decorations">
				{[...Array(5)].map((_, i) => (
					<div
						key={`tree-${i}`}
						style={{
							position: "absolute",
							width: "40px",
							height: "60px",
							backgroundImage:
								'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 60"><path d="M20,0 L40,40 L25,40 L25,60 L15,60 L15,40 L0,40 Z" fill="%23437A34" /></svg>\')',
							left: `${100 + i * 160}px`,
							top: `${20 + (i % 2) * 500}px`,
							zIndex: 1,
						}}
					/>
				))}
			</div>

			{/* Current user vicinity circle - fixed to move with the player */}
			{currentUser && (
				<div
					className="vicinity-circle"
					style={{
						position: "absolute",
						left: `${currentUser.position.x}px`,
						top: `${currentUser.position.y}px`,
						width: `${vicinityDistance * 2}px`,
						height: `${vicinityDistance * 2}px`,
						borderRadius: "50%",
						border: "2px dashed rgba(255, 204, 0, 0.6)",
						transform: "translate(-50%, -50%)",
						zIndex: 2,
						pointerEvents: "none",
						transition: "left 0.3s, top 0.3s",
						boxShadow: "inset 0 0 20px rgba(255, 204, 0, 0.2)",
					}}
				/>
			)}

			{/* Render all users */}
			{Object.values(users).map((user) => {
				const isCurrentUser = user.id === currentUser?.id;
				let inVicinity = false;

				if (currentUser && !isCurrentUser) {
					const dx = user.position.x - currentUser.position.x;
					const dy = user.position.y - currentUser.position.y;
					const distance = Math.sqrt(dx * dx + dy * dy);
					inVicinity = distance <= vicinityDistance;
				}

				const trainerType = getPokemonTrainer(user.id);
				const message = messages[user.id];

				return (
					<div
						key={user.id}
						style={{
							position: "absolute",
							left: `${user.position.x}px`,
							top: `${user.position.y}px`,
							width: "40px",
							height: "60px",
							transform: "translate(-50%, -50%)",
							zIndex: isCurrentUser ? 10 : 5,
							transition: "left 0.3s, top 0.3s",
						}}
					>
						{/* Character sprite */}
						<div
							style={{
								width: "40px",
								height: "60px",
								backgroundSize: "contain",
								backgroundRepeat: "no-repeat",
								backgroundPosition: "center bottom",
								filter: isCurrentUser ? "drop-shadow(0 0 5px #ffcc00)" : "none",
								// In a real app, use actual sprite images instead of colored divs
								backgroundColor: user.color,
								borderRadius: "8px 8px 0 0",
								position: "relative",
								overflow: "hidden",
							}}
						>
							{/* Simplified trainer representation */}
							<div
								style={{
									position: "absolute",
									bottom: "0",
									left: "0",
									width: "40px",
									height: "30px",
									borderRadius: "20px 20px 0 0",
									backgroundColor: "#333",
								}}
							/>
							<div
								style={{
									position: "absolute",
									bottom: "15px",
									left: "7px",
									width: "26px",
									height: "26px",
									borderRadius: "50%",
									backgroundColor: "#FFD700",
									border: "2px solid #333",
								}}
							/>
						</div>

						{/* Username */}
						<div
							className="username"
							style={{
								position: "absolute",
								left: "50%",
								bottom: "-16px",
								fontSize: "11px",
								fontWeight: "bold",
								color: "#fff",
								backgroundColor: "#3C5AA6",
								padding: "1px 6px",
								borderRadius: "10px",
								transform: "translateX(-50%)",
								whiteSpace: "nowrap",
								border: "1px solid #2A3C75",
								boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
							}}
						>
							{user.username}
						</div>

						{/* Message bubble - fixed to properly show */}
						{message && (
							<div
								className="message-bubble"
								style={{
									position: "absolute",
									left: "50%",
									top: "-45px",
									transform: "translateX(-50%)",
									backgroundColor: "white",
									border: "2px solid #3C5AA6",
									borderRadius: "12px",
									padding: "5px 10px",
									maxWidth: "150px",
									fontSize: "12px",
									boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
									zIndex: 20,
									animation: "fadeIn 0.3s ease-out",
								}}
							>
								{message.text}
								<div
									style={{
										position: "absolute",
										bottom: "-8px",
										left: "50%",
										marginLeft: "-8px",
										width: "16px",
										height: "8px",
										overflow: "hidden",
									}}
								>
									<div
										style={{
											content: '""',
											position: "absolute",
											top: "-8px",
											left: "0",
											width: "16px",
											height: "16px",
											transform: "rotate(45deg)",
											backgroundColor: "white",
											border: "2px solid #3C5AA6",
											borderTopWidth: "0",
											borderLeftWidth: "0",
										}}
									/>
								</div>
							</div>
						)}
					</div>
				);
			})}

			{/* Pokéball decoration in the corner */}
			<div
				style={{
					position: "absolute",
					right: "15px",
					bottom: "15px",
					width: "30px",
					height: "30px",
					borderRadius: "50%",
					background:
						"linear-gradient(to bottom, #ff1a1a 0%, #ff1a1a 50%, #f0f0f0 50%, #f0f0f0 100%)",
					border: "2px solid #333",
					zIndex: 3,
					boxShadow: "1px 1px 3px rgba(0,0,0,0.3)",
				}}
			>
				<div
					style={{
						position: "absolute",
						top: "50%",
						left: "0",
						width: "100%",
						height: "2px",
						backgroundColor: "#333",
					}}
				/>
				<div
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						width: "8px",
						height: "8px",
						borderRadius: "50%",
						backgroundColor: "#fff",
						border: "2px solid #333",
						transform: "translate(-50%, -50%)",
					}}
				/>
			</div>

			{/* CSS for animations */}
			<style>
				{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateX(-50%) translateY(10px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
          }
        `}
			</style>
		</div>
	);
};

// Example of App component to use the Ground
const App = () => {
	const [users, setUsers] = useState({
		user1: {
			id: "user1",
			username: "Ash",
			color: "#FF5722",
			position: { x: 100, y: 100 },
		},
		user2: {
			id: "user2",
			username: "Misty",
			color: "#2196F3",
			position: { x: 200, y: 200 },
		},
	});

	const [currentUser, setCurrentUser] = useState({
		id: "user1",
		username: "Ash",
		color: "#FF5722",
		position: { x: 100, y: 100 },
	});

	const handleMove = (position) => {
		// Update current user position
		setCurrentUser((prev) => ({
			...prev,
			position,
		}));

		// Update in the users collection
		setUsers((prev) => ({
			...prev,
			[currentUser.id]: {
				...prev[currentUser.id],
				position,
			},
		}));

		// In a real app, you'd send this position to your server
	};

	const handleSendMessage = (userId, message) => {
		// In a real app, this would send the message to other users
		console.log(`User ${userId} says: ${message}`);

		// For testing chat bubbles
		if (window.chatSystem && window.chatSystem.onMessage) {
			window.chatSystem.onMessage(userId, message);
		}
	};

	return (
		<div className="app">
			<Ground
				users={users}
				currentUser={currentUser}
				onMove={handleMove}
				vicinityDistance={100}
				onSendMessage={handleSendMessage}
			/>
			<div
				className="controls"
				style={{
					marginTop: "20px",
					padding: "10px",
					backgroundColor: "#f0f0f0",
					borderRadius: "8px",
				}}
			>
				<h3>Controls:</h3>
				<p>• Use Arrow Keys to move your character</p>
				<p>• Press Space to show a test message</p>
				<p>• Click anywhere to move directly to that spot</p>
			</div>
		</div>
	);
};

export default Ground;
