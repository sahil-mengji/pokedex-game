// pokedex.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Pokedex = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20); // Initially display 20

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        // Fetch all 151 Pokémon
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=151");
        const data = response.data.results;
        // Fetch details for each Pokémon
        const detailedData = await Promise.all(
          data.map(async (pokemon) => {
            const details = await axios.get(pokemon.url);
            return {
              id: details.data.id,
              name: details.data.name,
              // Prefer the official artwork if available
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

  // Handler for "Load More" button
  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 20);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Pokédex</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {pokemonList.slice(0, visibleCount).map((pokemon) => (
          // Use Link to navigate to the detail page instead of showing a modal
          <Link key={pokemon.id} to={`/pokedex/${pokemon.id}`}>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer">
              <img src={pokemon.image} alt={pokemon.name} className="w-full" />
              <h2 className="text-lg font-semibold text-center capitalize mt-2">
                {pokemon.name}
              </h2>
              <div className="flex justify-center mt-1">
                {pokemon.types.map((type, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-gray-200 rounded mx-1">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
      {visibleCount < pokemonList.length && (
        <div className="flex justify-center mt-6">
          <button onClick={loadMore} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Pokedex;
