// App.jsx
import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Pokedex from "./pokedex";
import PokemonDetail from "./pokemonDetail";
import Game from "./Game"; // Your game component
import AuthPage from "./AuthPage"; // Combined auth page

const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [rehydrated, setRehydrated] = useState(false);

  // Rehydrate user session from localStorage and validate it
  useEffect(() => {
    async function validateSession() {
      const storedUser = localStorage.getItem("trainer");
      const token = localStorage.getItem("token");
      console.log("Stored user:", storedUser);
      console.log("Stored token:", token);
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
          console.log("Validation response:", data);
          if (data.success) {
            setUser(data.user);
          } else {
            // Token is invalid or user not found; clear session
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

  // Dark mode effect
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
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-500 ease-in-out">
          <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 transition-all duration-500 ease-in-out">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent transition-all duration-500 ease-in-out">
              PokéGame
            </h1>
            <nav className="flex items-center space-x-4">
              <Link
                to="/pokedex"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white transition-all duration-300 ease-in-out hover:bg-blue-600 hover:scale-105"
              >
                Pokédex
              </Link>
              <Link
                to="/game"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-green-500 text-white transition-all duration-300 ease-in-out hover:bg-green-600 hover:scale-105"
              >
                Start Game
              </Link>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 dark:bg-gray-700 text-black dark:text-white transition-all duration-300 ease-in-out hover:opacity-90 hover:scale-105"
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </nav>
          </header>
          <Routes>
            <Route path="/pokedex" element={<Pokedex />} />
            <Route path="/pokedex/:id" element={<PokemonDetail />} />
            <Route path="/auth" element={<AuthPage />} />
            {/* Protected game route */}
            <Route
              path="/game"
              element={user ? <Game user={user} /> : <Navigate to="/auth" replace />}
            />
            <Route path="*" element={<Navigate to={user ? "/game" : "/auth"} replace />} />
          </Routes>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
