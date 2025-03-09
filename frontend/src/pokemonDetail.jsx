// pokemonDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const PokemonDetail = () => {
  const { id } = useParams(); // Get Pokémon ID from URL
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setPokemon(response.data);
      } catch (error) {
        console.error("Error fetching Pokémon details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetail();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!pokemon) return <div className="text-center mt-10">Error loading Pokémon details.</div>;

  return (
    <div className="container mx-auto p-4">
      <Link to="/pokedex" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 inline-block mb-4">
        Back to Pokédex
      </Link>
      <h1 className="text-3xl font-bold text-center capitalize mb-4">{pokemon.name}</h1>
      <div className="flex flex-col items-center">
        <img
          src={
            pokemon.sprites.other["official-artwork"].front_default ||
            pokemon.sprites.front_default
          }
          alt={pokemon.name}
          className="w-48 mb-4"
        />
        <div className="flex justify-center mb-4">
          {pokemon.types.map((type, index) => (
            <span key={index} className="px-3 py-1 bg-gray-200 rounded mx-1">
              {type.type.name}
            </span>
          ))}
        </div>
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-2">Stats</h2>
          <ul className="list-disc ml-6">
            {pokemon.stats.map((stat) => (
              <li key={stat.stat.name}>
                {stat.stat.name}: {stat.base_stat}
              </li>
            ))}
          </ul>
          {/* You can add more sections here for Abilities, Moves, etc. */}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
