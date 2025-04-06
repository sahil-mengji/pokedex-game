// App.jsx
import React, { useState, useEffect, createContext, useContext } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	useLocation,
} from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./index.css";

// Components
import Pokedex from "./pages/Pokedex/pokedex";
import PokemonDetail from "./pages/Pokedex/pokemonDetail";
import Game from "./pages/Game/Game";
import AuthPage from "./pages/AuthPage/AuthPage";
import Header from "./components/Header/header";
import Level1 from "./pages/Game/level1";
import { LayoutGroup } from "framer-motion";
import ChatGround from "./pages/ChatGround/ChatGround";

const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);

function AnimatedRoutes({ user }) {
	const location = useLocation();
	return (
		<TransitionGroup>
			<CSSTransition key={location.key} timeout={300} classNames="fade">
				<LayoutGroup>
					<Routes location={location}>
						<Route path="/" element={<Home />} />
						<Route path="/pokedex" element={<Pokedex />} />
						<Route path="/pokedex/:id" element={<PokemonDetail />} />
						<Route path="/auth" element={<AuthPage />} />
						<Route path="/level/1" element={<Level1 />} />
						<Route
							path="/game"
							element={
								user ? <Game user={user} /> : <Navigate to="/auth" replace />
							}
						/>
						<Route path="/ground" element={<ChatGround />} />
						<Route
							path="*"
							element={<Navigate to={user ? "/game" : "/auth"} replace />}
						/>
					</Routes>
				</LayoutGroup>
			</CSSTransition>
		</TransitionGroup>
	);
}

function Home() {
	return (
		<div className="p-8">
			<h2 className="text-2xl font-bold mb-4">Welcome to PokéGame!</h2>
			<p>This is the Home page. Use the navigation above to explore.</p>
		</div>
	);
}

function App() {
	const [darkMode, setDarkMode] = useState(false);
	const [user, setUser] = useState(null);
	const [rehydrated, setRehydrated] = useState(false);

	useEffect(() => {
		async function validateSession() {
			const storedUser = localStorage.getItem("trainer");
			const token = localStorage.getItem("token");
			if (storedUser && token) {
				try {
					const response = await fetch("http://localhost:5000/api/validate", {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: "Bearer " + token,
						},
					});
					const data = await response.json();
					if (data.success) {
						setUser(data.user);
						localStorage.setItem("trainer", JSON.stringify(data.user));
					} else {
						localStorage.removeItem("trainer");
						localStorage.removeItem("token");
						setUser(null);
					}
				} catch (error) {
					console.error("Validation error:", error);
					localStorage.removeItem("trainer");
					localStorage.removeItem("token");
					setUser(null);
				}
			}
			setRehydrated(true);
		}
		validateSession();
	}, []);

	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [darkMode]);

	if (!rehydrated) return <div>Loading...</div>;

	return (
		<UserContext.Provider value={{ user, setUser }}>
			<Router>
				<div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
					<Header darkMode={darkMode} setDarkMode={setDarkMode} />
					<div className="h-20">hi</div>
					<AnimatedRoutes user={user} />
				</div>
			</Router>
		</UserContext.Provider>
	);
}

export default App;
