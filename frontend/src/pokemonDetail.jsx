// pokemonDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const PokemonDetail = () => {
  const { id } = useParams(); // Using ID from URL; you could also support names
  const [pokemon, setPokemon] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      try {
        // Fetch main Pokémon details
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setPokemon(response.data);

        // Fetch species data to get evolution chain URL
        const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
        const evolutionChainUrl = speciesResponse.data.evolution_chain.url;
        const evolutionResponse = await axios.get(evolutionChainUrl);
        const chain = evolutionResponse.data.chain;

        // Recursively parse the evolution chain
        const evolutions = [];
        const parseChain = (node) => {
          if (node) {
            evolutions.push(node.species.name);
            if (node.evolves_to.length > 0) {
              node.evolves_to.forEach((child) => parseChain(child));
            }
          }
        };
        parseChain(chain);
        setEvolutionChain(evolutions);
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

  // Calculate the total of base stats
  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

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
          <h2 className="text-2xl font-semibold mb-2">Base Stats</h2>
          <ul className="list-disc ml-6">
            {pokemon.stats.map((stat) => (
              <li key={stat.stat.name}>
                {stat.stat.name}: {stat.base_stat}
              </li>
            ))}
          </ul>
          <div className="mt-2">
            <strong>Total Base Stats:</strong> {totalStats}
          </div>
        </div>
        <div className="max-w-md mx-auto mt-6">
          <h2 className="text-2xl font-semibold mb-2">Evolutions</h2>
          <div className="flex flex-wrap justify-center">
            {evolutionChain.map((name, index) => (
              <Link key={index} to={`/pokedex/${name}`}>
                <div className="m-2 p-2 border rounded">
                  <p className="capitalize">{name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
