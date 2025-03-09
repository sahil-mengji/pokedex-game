// PokemonDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

/**
 * Tailwind color classes for each Pokémon type.
 * Adjust or expand as desired.
 */
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

/** Maximum base stat in Pokémon (approx 255) for scaling bar heights */
const MAX_STAT = 255;

function PokemonDetail() {
  const { id } = useParams();            // e.g. /pokedex/1 => Bulbasaur
  const [pokemon, setPokemon] = useState(null);
  const [weaknesses, setWeaknesses] = useState([]);
  const [evolutions, setEvolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Recursively parse the evolution chain from the species endpoint.
   * Returns an array of Pokémon names in the chain (e.g. ["bulbasaur", "ivysaur", "venusaur"]).
   */
  const parseChain = (node, arr = []) => {
    if (!node) return arr;
    arr.push(node.species.name);
    if (node.evolves_to.length > 0) {
      node.evolves_to.forEach((child) => parseChain(child, arr));
    }
    return arr;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch the main Pokémon data
        const { data: pokeData } = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );
        setPokemon(pokeData);

        // 2. Fetch species data to get the evolution chain URL
        const { data: speciesData } = await axios.get(
          `https://pokeapi.co/api/v2/pokemon-species/${id}`
        );

        // 3. Fetch the evolution chain and parse it
        const evoChainUrl = speciesData.evolution_chain.url;
        const { data: evoData } = await axios.get(evoChainUrl);
        const chainArray = parseChain(evoData.chain);

        // 4. For each Pokémon in the chain, fetch its artwork & ID
        const evoDetails = [];
        for (const evoName of chainArray) {
          try {
            const { data: evoMon } = await axios.get(
              `https://pokeapi.co/api/v2/pokemon/${evoName}`
            );
            evoDetails.push({
              id: evoMon.id,
              name: evoMon.name,
              imageUrl:
                evoMon.sprites.other["official-artwork"].front_default ||
                evoMon.sprites.front_default,
            });
          } catch (e) {
            console.error(`Error fetching evolution data for ${evoName}:`, e);
          }
        }
        setEvolutions(evoDetails);

        // 5. Calculate weaknesses by checking each type’s damage relations
        const allWeaknesses = new Set();
        for (const t of pokeData.types) {
          const typeName = t.type.name;
          const { data: typeData } = await axios.get(
            `https://pokeapi.co/api/v2/type/${typeName}`
          );
          // "double_damage_from" indicates weaknesses
          typeData.damage_relations.double_damage_from.forEach((w) =>
            allWeaknesses.add(w.name)
          );
        }
        setWeaknesses(Array.from(allWeaknesses));
      } catch (err) {
        setError("Failed to load Pokémon data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error || !pokemon) {
    return <div className="text-center mt-10">{error || "Error loading data."}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Link back to Pokédex grid */}
      <Link to="/pokedex" className="mb-4 inline-block text-blue-500 underline">
        Back to Pokédex
      </Link>

      {/* Pokémon name & artwork */}
      <h1 className="text-3xl font-bold text-center capitalize">{pokemon.name}</h1>
      <div className="flex justify-center mt-4">
        <img
          src={
            pokemon.sprites.other["official-artwork"].front_default ||
            pokemon.sprites.front_default
          }
          alt={pokemon.name}
          className="w-40 h-40 object-contain"
        />
      </div>

      {/* Types */}
      <h2 className="text-xl font-semibold mt-6">Type</h2>
      <div className="flex flex-wrap gap-2">
        {pokemon.types.map((t) => (
          <span
            key={t.type.name}
            className={`px-2 py-1 rounded text-white ${typeColors[t.type.name] || "bg-gray-400"}`}
          >
            {t.type.name}
          </span>
        ))}
      </div>

      {/* Weaknesses */}
      <h2 className="text-xl font-semibold mt-6">Weaknesses</h2>
      <div className="flex flex-wrap gap-2">
        {weaknesses.length === 0 ? (
          <span className="px-2 py-1 rounded bg-gray-300 text-white">None</span>
        ) : (
          weaknesses.map((w) => (
            <span
              key={w}
              className={`px-2 py-1 rounded text-white ${typeColors[w] || "bg-gray-400"}`}
            >
              {w}
            </span>
          ))
        )}
      </div>

      {/* Stats as vertical bars */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Stats</h2>
      <div className="flex items-end justify-around bg-gray-100 p-4 rounded">
        {pokemon.stats.map((stat) => {
          const heightPercent = (stat.base_stat / MAX_STAT) * 100;
          return (
            <div key={stat.stat.name} className="flex flex-col items-center mx-1">
              <div className="w-4 h-32 bg-gray-300 relative overflow-hidden rounded">
                <div
                  className="absolute bottom-0 left-0 w-full bg-blue-500"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <p className="text-xs mt-1 uppercase">{stat.stat.name}</p>
            </div>
          );
        })}
      </div>

      {/* Evolutions in a horizontal layout */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Evolutions</h2>
      {evolutions.length === 0 ? (
        <p className="text-center">No evolutions found.</p>
      ) : (
        <div className="flex items-center justify-center flex-wrap">
          {evolutions.map((evo, index) => (
            <div key={evo.id} className="flex items-center m-2">
              <Link to={`/pokedex/${evo.id}`} className="flex flex-col items-center">
                <img
                  src={evo.imageUrl}
                  alt={evo.name}
                  className="w-20 h-20 object-contain"
                />
                <p className="capitalize mt-1">{evo.name}</p>
                <p className="text-sm text-gray-500">
                  #{String(evo.id).padStart(3, "0")}
                </p>
              </Link>
              {index < evolutions.length - 1 && (
                <span className="mx-4 text-gray-400 text-2xl">➜</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PokemonDetail;
