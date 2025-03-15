// App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Pokedex from "./pokedex";
import PokemonDetail from "./pokemonDetail";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  
  // Toggle the "dark" class on the root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-500 ease-in-out">
        <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 transition-all duration-500 ease-in-out">
          <Link to="/" className="flex items-center space-x-3 transform transition duration-300 ease-in-out hover:scale-105">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent transition-all duration-500 ease-in-out">
              PokéGame
            </h1>
          </Link>
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
          <Route path="/" element={<Pokedex />} />
          <Route path="/pokedex" element={<Pokedex />} />
          <Route path="/pokedex/:id" element={<PokemonDetail />} />
          <Route
            path="/game"
            element={
              <div className="text-center text-2xl mt-10">Game Coming Soon!</div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
