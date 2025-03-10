// pokedex.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const typeColorsCards = {
  normal: "from-gray-300 to-gray-400",
  fire: "from-orange-300 to-orange-400",
  water: "from-blue-300 to-blue-400",
  grass: "from-green-300 to-green-400",
  electric: "from-yellow-300 to-yellow-500",
  ice: "from-blue-200 to-blue-300",
  fighting: "from-red-300 to-red-400",
  poison: "from-purple-300 to-purple-400",
  ground: "from-yellow-400 to-yellow-500",
  flying: "from-indigo-300 to-indigo-400",
  psychic: "from-pink-300 to-pink-400",
  bug: "from-green-400 to-green-500",
  rock: "from-gray-400 to-gray-500",
  ghost: "from-purple-400 to-purple-500",
  dragon: "from-indigo-400 to-indigo-500",
  dark: "from-gray-600 to-gray-700",
  steel: "from-gray-400 to-gray-500",
  fairy: "from-pink-200 to-pink-300",
};

const typeColors = {
  normal: "bg-gray-400",
  fire: "bg-orange-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-400",
  ice: "bg-blue-300",
  fighting: "bg-red-600",
  poison: "bg-purple-500",
  ground: "bg-yellow-700",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-green-600",
  rock: "bg-gray-600",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-700",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
};


const Pokedex = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20); // initially show 20 Pokémon
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=151"
        );
        const data = response.data.results;
        const detailedData = await Promise.all(
          data.map(async (pokemon) => {
            const details = await axios.get(pokemon.url);
            return {
              id: details.data.id,
              name: details.data.name,
              image:
                details.data.sprites.other["official-artwork"].front_default ||
                details.data.sprites.front_default,
              types: details.data.types.map((type) => type.type.name),
            };
          })
        );
        setPokemonList(detailedData);
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
      }
    };

    fetchPokemon();
  }, []);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  // Filter Pokémon based on the search term
  const filteredList = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Pokédex</h1>

      {/* Search Bar */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded w-full max-w-md"
        />
      </div>

      {/* Pokémon Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredList.slice(0, visibleCount).map((pokemon) => (
          <Link key={pokemon.id} to={`/pokedex/${pokemon.id}`}>
          <div
            className={`relative p-4 rounded-xl shadow-md hover:shadow-lg cursor-pointer 
              bg-gradient-to-r ${
                pokemon.types.length > 1
                  ? `${typeColorsCards[pokemon.types[0]]} ${typeColorsCards[pokemon.types[1]]}`
                  : typeColorsCards[pokemon.types[0]]
              } bg-opacity-80`}
          >
            {/* Pokémon ID on the Top-Left */}
            <span className="absolute top-2 left-2 text-xs font-semibold text-white bg-black bg-opacity-50 px-2 py-1 rounded">
              #{pokemon.id.toString().padStart(4, "0")}
            </span>
        
            {/* Pokémon Image */}
            <img src={pokemon.image} alt={pokemon.name} className="w-full" />
        
            {/* Pokémon Name */}
            <h2 className="text-lg font-semibold text-center capitalize mt-2 text-gray-900">
              {pokemon.name}
            </h2>
        
            {/* Pokémon Types */}
            <div className="flex justify-center mt-1">
              {pokemon.types.map((type, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 text-xs text-white font-semibold rounded mx-1 border border-white shadow-md 
                  ${typeColors[type] || "bg-gray-500"}`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              ))}
            </div>
          </div>
        </Link>
             
        ))}
        
      </div>

      {/* Load More Button */}
      {visibleCount < filteredList.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Load More Pokemon
          </button>
        </div>
      )}
    </div>
  );
};

export default Pokedex;
