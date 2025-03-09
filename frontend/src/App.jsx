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
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <header className="flex justify-between items-center p-4">
          <h1 className="text-3xl font-bold">Pokémon Game</h1>
          <div className="flex items-center space-x-4">
            <Link
              to="/pokedex"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Pokédex
            </Link>
            <Link
              to="/game"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
            >
              Start Game
            </Link>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
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
