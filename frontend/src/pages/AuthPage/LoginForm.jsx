// LoginForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../App";

const LoginForm = () => {
	const { setUser } = useUser();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMsg("");
		setLoading(true);

		try {
			// First, login
			const response = await fetch("http://localhost:5000/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			const data = await response.json();
			if (data.success) {
				localStorage.setItem("token", data.token);
				localStorage.setItem("name", data.name);

				// Immediately call the validate endpoint to get full user data
				const validateResponse = await fetch(
					"http://localhost:5000/api/validate",
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: "Bearer " + data.token,
						},
					}
				);
				const validateData = await validateResponse.json();
				if (validateData.success) {
					localStorage.setItem("trainer", JSON.stringify(validateData.user));
					setUser(validateData.user);
					navigate("/ground");
				} else {
					setErrorMsg(validateData.error || "Validation failed.");
				}
			} else {
				setErrorMsg(data.error || "Login failed.");
			}
		} catch (err) {
			setErrorMsg("Error during login: " + err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label className="text-[#80e9a6] placeholder:text-[#80e9a6]">
					Email:
				</label>
				<input
					type="email"
					placeholder="Enter your email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					className="bg-[#15803d] mt-1 p-2 border rounded w-full text-white placeholder:text-[#80e9a6] border-[#80e9a6]"
				/>
			</div>
			<div>
				<label className="text-[#80e9a6]">Password:</label>
				<input
					type="password"
					placeholder="Enter your password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					className="bg-[#15803d] mt-1 p-2 border rounded w-full"
				/>
			</div>
			<button
				type="submit"
				disabled={loading}
				className="bg-[#15803d] mt-1 p-2 border rounded w-full text-white placeholder:text-[#80e9a6] border-[#80e9a6]"
			>
				{loading ? "Logging in..." : "Login"}
			</button>
			{errorMsg && <p className="text-red-500">{errorMsg}</p>}
		</form>
	);
};

export default LoginForm;
