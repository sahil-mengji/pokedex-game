// PokemonDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

// Hex color codes for each Pokémon type
const typeColorCodes = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  grass: "#7AC74C",
  electric: "#F7D02C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const MAX_STAT = 255;

// Helper: Capitalize first letter
function capFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function PokemonDetail() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [weaknesses, setWeaknesses] = useState([]);
  const [strengths, setStrengths] = useState([]);
  const [evolutions, setEvolutions] = useState([]);
  const [flavorText, setFlavorText] = useState("");
  const [category, setCategory] = useState("");
  const [genderRate, setGenderRate] = useState(null);
  const [abilities, setAbilities] = useState([]);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determine the primary type color
  const [primaryTypeColor, setPrimaryTypeColor] = useState("#cccccc");

  // Recursively parse evolution chain
  const parseChain = (node, arr = []) => {
    if (!node) return arr;
    arr.push(node.species.name);
    if (node.evolves_to.length > 0) {
      node.evolves_to.forEach((child) => parseChain(child, arr));
    }
    return arr;
  };

  // Convert gender rate to text
  const getGenderText = () => {
    if (genderRate === -1) return "Genderless";
    const femalePercent = (genderRate * 12.5).toFixed(1);
    const malePercent = (100 - femalePercent).toFixed(1);
    return `Male: ${malePercent}%, Female: ${femalePercent}%`;
  };

  // Global navigation by ID (prev/next)
  const prevId = Math.max(1, parseInt(id, 10) - 1);
  const nextId = Math.min(151, parseInt(id, 10) + 1);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch main Pokémon data
        const { data: pokeData } = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );
        setPokemon(pokeData);

        // Primary type color (only the first type)
        if (pokeData.types.length > 0) {
          const firstType = pokeData.types[0].type.name;
          setPrimaryTypeColor(typeColorCodes[firstType] || "#cccccc");
        }

        // Height & Weight
        const heightM = pokeData.height / 10;
        const heightFt = (heightM * 3.28084).toFixed(2);
        const weightKg = pokeData.weight / 10;
        const weightLbs = (weightKg * 2.20462).toFixed(1);
        setHeight(`${heightM.toFixed(2)} m (${heightFt} ft)`);
        setWeight(`${weightKg.toFixed(1)} kg (${weightLbs} lbs)`);

        // Abilities
        const abilityList = pokeData.abilities.map((ab) =>
          ab.is_hidden
            ? `${capFirst(ab.ability.name)} (Hidden)`
            : capFirst(ab.ability.name)
        );
        setAbilities(abilityList);

        // Weaknesses & Strengths
        const weaknessSet = new Set();
        const strengthSet = new Set();
        for (const t of pokeData.types) {
          const typeName = t.type.name;
          const { data: typeData } = await axios.get(
            `https://pokeapi.co/api/v2/type/${typeName}`
          );
          typeData.damage_relations.double_damage_from.forEach((w) =>
            weaknessSet.add(w.name)
          );
          typeData.damage_relations.double_damage_to.forEach((s) =>
            strengthSet.add(s.name)
          );
        }
        setWeaknesses([...weaknessSet]);
        setStrengths([...strengthSet]);

        // 2. Fetch species data => flavor text, category, gender, evolution chain
        const { data: speciesData } = await axios.get(
          `https://pokeapi.co/api/v2/pokemon-species/${id}`
        );
        // Flavor text
        const flavorEntry = speciesData.flavor_text_entries.find(
          (entry) => entry.language.name === "en"
        );
        setFlavorText(
          flavorEntry
            ? flavorEntry.flavor_text.replace(/\f|\n|\r/g, " ")
            : ""
        );
        // Category
        const genusEntry = speciesData.genera.find(
          (g) => g.language.name === "en"
        );
        setCategory(genusEntry ? genusEntry.genus : "Pokémon");
        // Gender rate
        setGenderRate(speciesData.gender_rate);

        // Evolution chain
        const evoChainUrl = speciesData.evolution_chain.url;
        const { data: evoData } = await axios.get(evoChainUrl);
        const chainArray = parseChain(evoData.chain);

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
              types: evoMon.types.map((t) => t.type.name),
            });
          } catch (e) {
            console.error(`Error fetching evolution data for ${evoName}:`, e);
          }
        }
        setEvolutions(evoDetails);
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
    <div
      className="min-h-screen p-4"
      style={{
        backgroundColor: primaryTypeColor,
        // Use a lower alpha if you want even less opacity
        backgroundImage:
          "repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0 20px, transparent 20px 40px)",
      }}
    >
      {/* Container for main content (white box) */}
      <div className="bg-gray-200/95 backdrop-blur-md p-4 rounded-4 relative z-10 rounded-xl shadow-xl max-w-5xl mx-auto">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold capitalize text-gray-900">
            {pokemon.name} #{pokemon.id.toString().padStart(4, "0")}
          </h1>
        </div>

        {/* Flavor Text & Two-column layout: Left: Profile box, Right: Pokémon image */}
        {flavorText && (
          <p className="max-w-xl mx-auto text-center text-gray-800 italic mb-6">
            {flavorText}
          </p>
        )}
        <div className="flex flex-col md:flex-row gap-4 items-start justify-center mb-6">
          {/* left: Main Image */}
          <div className="md:w-1/2 flex justify-center bg-gray-300 border-2 rounded-lg p-4">
            <img
              loading="lazy"
              src={
                pokemon.sprites.other["official-artwork"].front_default ||
                pokemon.sprites.front_default
              }
              alt={pokemon.name}
              className="w-64 h-64 object-contain"
              />
          </div>
          {/* Right: Profile Box */}
          <div className="md:w-1/3 p-4 rounded-xl shadow-md bg-blue-300 border border-gray-300">
            <h2 className="text-2xl font-bold text-center mb-2">Profile</h2>
            <div className="text-sm text-gray-800 space-y-2">
              <p>
                <strong>Height:</strong> {height}
              </p>
              <p>
                <strong>Weight:</strong> {weight}
              </p>
              <p>
                <strong>Gender:</strong> {genderRate === -1 ? "Genderless" : `Male/Female`}
              </p>
              <p>
                <strong>Category:</strong> {category}
              </p>
              <p>
                <strong>Abilities:</strong> {abilities.join(", ")}
              </p>
            </div>
          </div>
        </div>

        {/* Type, Weaknesses, Strengths, Stats in a row */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Left Column: Types, Weaknesses, Strengths */}
          <div className="md:w-1/2 space-y-4 text-center">
            {/* Types */}
            <div>
              <h2 className="text-xl font-semibold">Type</h2>
              <div className="flex justify-center gap-2 mt-2 flex-wrap">
                {pokemon.types.map((t) => (
                  <span
                    key={t.type.name}
                    className="px-3 py-1 rounded text-white"
                    style={{ backgroundColor: typeColorCodes[t.type.name] || "#ccc" }}
                  >
                    {capFirst(t.type.name)}
                  </span>
                ))}
              </div>
            </div>
            {/* Weaknesses */}
            <div>
              <h2 className="text-xl font-semibold">Weaknesses</h2>
              <div className="flex justify-center gap-2 mt-2 flex-wrap">
                {weaknesses.length === 0 ? (
                  <span className="px-3 py-1 rounded bg-gray-300 text-white">
                    None
                  </span>
                ) : (
                  weaknesses.map((w) => (
                    <span
                      key={w}
                      className="px-3 py-1 rounded text-white"
                      style={{ backgroundColor: typeColorCodes[w] || "#ccc" }}
                    >
                      {capFirst(w)}
                    </span>
                  ))
                )}
              </div>
            </div>
            {/* Strengths */}
            <div>
              <h2 className="text-xl font-semibold">Strengths</h2>
              <div className="flex justify-center gap-2 mt-2 flex-wrap">
                {strengths.length === 0 ? (
                  <span className="px-3 py-1 rounded bg-gray-300 text-white">
                    None
                  </span>
                ) : (
                  strengths.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded text-white"
                      style={{ backgroundColor: typeColorCodes[s] || "#ccc" }}
                    >
                      {capFirst(s)}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
          {/* Right Column: Stats */}
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold text-center mb-3">Stats</h2>
            <div className="grid grid-cols-6 gap-2 place-items-center bg-gray-100 p-2 rounded">
              {pokemon.stats.map((stat) => {
                const heightPercent = (stat.base_stat / MAX_STAT) * 100;
                return (
                  <div key={stat.stat.name} className="flex flex-col items-center">
                    <div className="w-4 h-24 bg-gray-200 relative overflow-hidden rounded shadow-md border border-gray-300">
                      <div
                        className="absolute bottom-0 left-0 w-full bg-blue-500 transition-all duration-500 ease-in-out"
                        style={{
                          height: `${heightPercent}%`,
                          backgroundImage:
                            "linear-gradient(to top, rgba(255,255,255,0.2), transparent)",
                        }}
                      />
                    </div>
                    <p className="text-xs mt-1 uppercase text-gray-700 text-center">
                      {stat.stat.name}
                    </p>
                    <p className="text-sm font-semibold text-center">
                      {stat.base_stat}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Evolution Chain in a separate gray box */}
      <div className="bg-gray-200/50 backdrop-blur-md p-4 rounded-xl shadow-xl max-w-5xl mx-auto mt-6 relative z-10">
        <h2 className="text-2xl font-bold text-center mb-3">Evolution Chain</h2>
        <div className="flex items-center justify-center space-x-4">
          {evolutions.map((evo, idx) => (
            <div key={evo.id} className="flex flex-col items-center">
              <Link to={`/pokedex/${evo.id}`}>
              
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden mb-2">
                  <img
                    loading="lazy"
                    src={evo.imageUrl}
                    alt={evo.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                
              </Link>
              <p className="text-lg font-bold capitalize text-gray-800">
                {evo.name}{" "}
                <div className="flex flex-col items-center ml-1 text-sm text-gray-600">
                  #{String(evo.id).padStart(4, "0")}
                </div>
              </p>
              <div className="flex space-x-2 mt-1">
                {evo.types?.map((type) => (
                  <span
                    key={type}
                    className="px-2 py-1 text-xs text-white font-semibold rounded"
                    style={{ backgroundColor: typeColorCodes[type] || "#ccc" }}
                  >
                    {capFirst(type)}
                  </span>
                ))}
              </div>
              {/* Arrow for next evolution */}
            </div>
          ))}
        </div>
      </div>

      {/* Global Navigation: Prev/Next Pokémon at the bottom */}
      <div className="flex justify-between items-center mt-8 max-w-5xl mx-auto">
        {pokemon.id > 1 ? (
          <Link
            to={`/pokedex/${pokemon.id - 1}`}
            className="text-lg bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            &larr; Prev
          </Link>
        ) : (
          <div />
        )}
        {pokemon.id < 151 ? (
          <Link
            to={`/pokedex/${pokemon.id + 1}`}
            className="text-lg bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Next &rarr;
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

export default PokemonDetail;
