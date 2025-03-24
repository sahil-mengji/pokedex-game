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
  const [visibleCount, setVisibleCount] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get("http://localhost:5000/pokemon");
        setPokemonList(response.data);
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  const filteredList = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen transition-opacity duration-500">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 transition-all duration-500 ease-in-out bg-white dark:bg-gray-800">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800 dark:text-gray-300 transition-colors duration-500 ease-in-out">
        Pokédex
      </h1>

      {/* Search Bar with Clear Button */}
      <div className="mb-6 flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search Pokémon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-300 transition-colors duration-300 ease-in-out bg-gray-50 dark:bg-gray-700"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Pokémon Grid */}
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 transition-all duration-500">
          {filteredList.slice(0, visibleCount).map((pokemon) => (
            <Link key={pokemon.pokemon_id} to={`/pokedex/${pokemon.pokemon_id}`}>
              <div
                className={`relative group p-4 rounded-2xl shadow-lg bg-gradient-to-r transition-all transform duration-300 hover:scale-105 hover:shadow-2xl
                ${
                  pokemon.types.length > 1
                    ? `${typeColorsCards[pokemon.types[0].toLowerCase()]} ${typeColorsCards[pokemon.types[1].toLowerCase()]}`
                    : typeColorsCards[pokemon.types[0].toLowerCase()]
                } bg-opacity-90 dark:bg-opacity-80`}
              >
                {/* Pokémon ID */}
                <span className="absolute top-2 left-2 text-xs font-semibold text-white bg-black bg-opacity-50 px-2 py-1 rounded transition-all duration-300">
                  #{pokemon.pokemon_id.toString().padStart(4, "0")}
                </span>

                {/* Pokémon Image */}
                <img
                  loading="lazy"
                  src={pokemon.img_src}
                  alt={pokemon.name}
                  className="w-full transition-transform duration-300 group-hover:scale-110"
                />

                {/* Pokémon Name */}
                <h2 className="mt-4 text-xl font-bold text-center capitalize text-gray-900 transition-transform duration-300 group-hover:scale-105">
                  {pokemon.name}
                </h2>

                {/* Pokémon Types */}
                <div className="flex justify-center mt-2">
                  {pokemon.types.map((type, index) => (
                    <span
                      key={index}
                      className={`mx-1 px-3 py-1 text-xs font-medium text-white rounded-full border border-white shadow-sm transition-all duration-300
                      ${typeColors[type.toLowerCase()] || "bg-gray-500"}`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-lg text-gray-600 dark:text-gray-300">
          No Pokémon found.
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredList.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full shadow transition-colors duration-300 transform hover:scale-105"
          >
            Load More Pokémon
          </button>
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollButton && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-colors duration-300 transform hover:scale-105"
        >
          ⬆
        </button>
      )}
    </div>
  );
};

export default Pokedex;
