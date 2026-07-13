// src/components/UserJoin.js
import React, { useState } from "react";

const UserJoin = ({ onJoin }) => {
	const [username, setUsername] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!username.trim()) return;

		onJoin(username);
	};

	return (
		<div
			className="user-join"
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				padding: "20px",
				border: "1px solid #ccc",
				borderRadius: "8px",
				backgroundColor: "#f9f9f9",
				boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
				maxWidth: "400px",
				margin: "100px auto",
			}}
		>
			<h2>Join Digital Ground</h2>
			<p>Enter a username to start exploring</p>

			<form
				onSubmit={handleSubmit}
				style={{
					width: "100%",
					marginTop: "20px",
				}}
			>
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="Username"
					style={{
						width: "100%",
						padding: "10px",
						marginBottom: "15px",
						borderRadius: "4px",
						border: "1px solid #ccc",
					}}
				/>

				<button
					type="submit"
					disabled={!username.trim()}
					style={{
						width: "100%",
						padding: "10px",
						backgroundColor: "#2196F3",
						color: "white",
						border: "none",
						borderRadius: "4px",
						cursor: username.trim() ? "pointer" : "not-allowed",
						opacity: username.trim() ? 1 : 0.7,
					}}
				>
					Enter
				</button>
			</form>
		</div>
	);
};

export default UserJoin;

// src/App.css
/*
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.main-content {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}
*/
