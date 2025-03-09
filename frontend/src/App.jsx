// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Pokedex from "./pokedex";
import PokemonDetail from "./pokemonDetail";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <header className="text-center py-6">
          <h1 className="text-5xl font-bold">Pokémon Game</h1>
          <div className="mt-4">
            <Link to="/pokedex" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mx-2">
              Pokédex
            </Link>
            <Link to="/game" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 mx-2">
              Start Game
            </Link>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<Pokedex />} />
          <Route path="/pokedex" element={<Pokedex />} />
          <Route path="/pokedex/:id" element={<PokemonDetail />} />
          <Route path="/game" element={<div className="text-center text-2xl mt-10">Game Coming Soon!</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
