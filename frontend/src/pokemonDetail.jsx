// PokemonDetail.jsx
import React, { useEffect, useState, useCallback } from "react";
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
const legendaryIds = [144, 145, 146, 150, 151];

function PokemonDetail() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [primaryTypeColor, setPrimaryTypeColor] = useState("#cccccc");
  const [animateBars, setAnimateBars] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  // Function to fetch Pokémon data; can be re-used for retrying
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`http://localhost:5000/pokemon-detail/${id}`);
      setPokemon(data);
      // Set primary type color (data.types is an array of strings)
      if (data.types && data.types.length > 0) {
        const firstType = data.types[0].toLowerCase();
        setPrimaryTypeColor(typeColorCodes[firstType] || "#cccccc");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load Pokémon data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Scroll to top on mount or when id changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Trigger stat bar animation shortly after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateBars(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Trigger fade-in effect for main content and evolution chain
  useEffect(() => {
    const timer = setTimeout(() => {
      setContentVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen transition-opacity duration-500">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (error || !pokemon) {
    return (
      <div className="text-center mt-10 space-y-4">
        <div className="text-lg text-red-600">{error || "Error loading data."}</div>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Retry
        </button>
      </div>
    );
  }

  // Convert stats object to an array for rendering.
  const statsArray = Object.entries(pokemon.stats).map(([key, value]) => ({
    name: key,
    base_stat: value,
  }));

  // Determine if this Pokémon is legendary
  const isLegendary = legendaryIds.includes(Number(pokemon.id));

  return (
    <div
      className="min-h-screen p-4 font-sans transition-all duration-500"
      style={{
        backgroundColor: primaryTypeColor,
        backgroundImage:
          "repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0 20px, transparent 20px 40px)",
      }}
    >
      {/* Main Content Container */}
      <div
        className={`relative ${
          isLegendary ? "ring-4 ring-yellow-400 ring-offset-2" : ""
        } bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-6 rounded-3xl shadow-2xl max-w-5xl mx-auto transition-opacity duration-500 ease-in-out ${
          contentVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Pokéball Watermark */}
        <div className="absolute right-4 top-4 opacity-10 pointer-events-none">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
            alt="Pokéball watermark"
            className="w-16 h-16"
          />
        </div>

        {/* Title */}
        <div className="text-center mb-6 pt-8">
          <h1 className="text-4xl font-bold capitalize text-gray-900 dark:text-gray-100 tracking-wide">
            {pokemon.name} #{String(pokemon.id).padStart(4, "0")}
          </h1>
          {isLegendary && (
            <p className="mt-2 text-xl text-purple-600 font-semibold animate-pulse">
              A Legendary Pokémon!
            </p>
          )}
        </div>

        {/* Flavor Text */}
        {pokemon.details?.flavor_text && (
          <p className="max-w-xl mx-auto text-center text-gray-700 dark:text-gray-300 italic mb-6">
            {pokemon.details.flavor_text}
          </p>
        )}

        {/* Profile & Image */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center mb-8">
          {/* Pokémon Image */}
          <div className="md:w-1/2 flex justify-center bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-3xl p-4 transition-transform duration-300 hover:scale-105">
            <img
              loading="lazy"
              src={pokemon.img_src}
              alt={pokemon.name}
              className="w-64 h-64 object-contain"
            />
          </div>

          {/* Profile Box */}
          <div className="bg-blue-500 rounded-3xl p-6 md:w-1/2 text-white shadow-lg transition-transform duration-300 hover:scale-105">
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              {/* Row 1: Labels */}
              <div className="font-semibold text-left">Height</div>
              <div className="font-semibold">Category</div>

              {/* Row 2: Values */}
              <div className="text-left text-lg">
                {pokemon.height ? pokemon.height : "—"} m
              </div>
              <div className="text-lg">
                {pokemon.details?.category || "Pokémon"}
              </div>

              {/* Row 3: Labels */}
              <div className="font-semibold text-left">Weight</div>
              <div className="font-semibold">Abilities</div>

              {/* Row 4: Values */}
              <div className="text-left text-lg">
                {pokemon.weight ? pokemon.weight : "—"} kg
              </div>
              <div className="text-lg">
                {pokemon.abilities && pokemon.abilities.length > 0
                  ? pokemon.abilities.join(", ")
                  : "—"}
              </div>

              {/* Row 5: Label */}
              <div className="font-semibold text-left">Gender</div>
              <div />

              {/* Row 6: Value */}
              <div className="text-left text-lg">
                {pokemon.genders && pokemon.genders.length > 0
                  ? pokemon.genders.join(", ")
                  : "Genderless"}
              </div>
              <div />
            </div>
          </div>
        </div>

        {/* Types, Weaknesses, Stats */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Types & Weaknesses */}
          <div className="md:w-1/2 space-y-8 text-center">
            {/* Types */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Type
              </h2>
              <div className="flex justify-center gap-3 flex-wrap">
                {pokemon.types.map((t) => (
                  <span
                    key={t}
                    className="px-4 py-2 rounded-full text-white font-medium shadow-md transition-transform duration-300 hover:scale-105"
                    style={{ backgroundColor: typeColorCodes[t.toLowerCase()] || "#ccc" }}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </span>
                ))}
              </div>
            </div>
            {/* Weaknesses */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Weaknesses
              </h2>
              <div className="flex justify-center gap-3 flex-wrap">
                {pokemon.weaknesses && pokemon.weaknesses.length > 0 ? (
                  pokemon.weaknesses.map((w) => (
                    <span
                      key={w}
                      className="px-4 py-2 rounded-full text-white font-medium shadow-md transition-transform duration-300 hover:scale-105"
                      style={{ backgroundColor: typeColorCodes[w.toLowerCase()] || "#ccc" }}
                    >
                      {w.charAt(0).toUpperCase() + w.slice(1)}
                    </span>
                  ))
                ) : (
                  <span className="px-4 py-2 rounded-full bg-gray-400 text-white font-medium shadow-md">
                    None
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Stats */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md w-full md:w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
              Stats
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {statsArray.map((stat) => {
                const statPercent = (stat.base_stat / MAX_STAT) * 100;
                return (
                  <div key={stat.name} className="flex flex-col">
                    {/* Stat Name & Value */}
                    <div className="flex justify-between items-center mb-1">
                      <span className="capitalize text-gray-700 dark:text-gray-300 font-medium">
                        {stat.name}
                      </span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">
                        {stat.base_stat}
                      </span>
                    </div>
                    {/* Animated Horizontal Bar */}
                    <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: animateBars ? `${statPercent}%` : "0%" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Evolution Chain */}
      <div
        className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-3xl shadow-2xl max-w-5xl mx-auto mt-6 relative z-10 transition-opacity duration-500 ease-in-out ${
          contentVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          Evolutions
        </h2>
        {(() => {
          const prevEvos = pokemon.previous_evolutions || [];
          const nextEvos = pokemon.next_evolutions || [];
          const chain = [
            ...prevEvos,
            {
              id: pokemon.id,
              name: pokemon.name,
              img_src: pokemon.img_src,
              types: pokemon.types || [],
            },
            ...nextEvos,
          ];

          const EvolutionCircle = ({ evoData }) => (
            <div className="flex flex-col items-center transition-transform duration-300 hover:scale-105">
              <Link to={`/pokedex/${evoData.id}`}>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg overflow-hidden mb-2">
                  <img
                    loading="lazy"
                    src={evoData.img_src}
                    alt={evoData.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </Link>
              <p className="text-md sm:text-lg font-bold capitalize text-gray-800 dark:text-gray-100">
                {evoData.name}
                <span className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  #{String(evoData.id).padStart(4, "0")}
                </span>
              </p>
              <div className="flex space-x-2 mt-2">
                {evoData.types?.map((type) => (
                  <span
                    key={type}
                    className="px-2 py-1 text-xs text-white font-semibold rounded-full shadow transition-transform duration-300 hover:scale-105"
                    style={{
                      backgroundColor: typeColorCodes[type.toLowerCase()] || "#ccc",
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          );

          // Special case for Eevee
          if (chain[0].id === 133) {
            const eevee = chain[0];
            const evolutions = chain.slice(1);
            return (
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
                <EvolutionCircle evoData={eevee} />
                {evolutions.length > 0 && (
                  <div className="text-4xl text-gray-500 font-bold hidden sm:block relative -mt-3">
                    &rarr;
                  </div>
                )}
                <div className="flex gap-4 sm:gap-8">
                  {evolutions.map((evo) => (
                    <EvolutionCircle evoData={evo} key={evo.id} />
                  ))}
                </div>
              </div>
            );
          }

          // Default: arrow between each stage
          return (
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
              {chain.map((poke, idx) => (
                <React.Fragment key={poke.id}>
                  <EvolutionCircle evoData={poke} />
                  {idx < chain.length - 1 && (
                    <div className="text-4xl text-gray-500 font-bold hidden sm:block relative -mt-3">
                      &rarr;
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          );
        })()}
      </div>

      {/* Global Navigation */}
      <div className="flex flex-col items-center mt-8 max-w-5xl mx-auto space-y-4">
        <div className="flex justify-between w-full">
          {pokemon.id > 1 ? (
            <Link
              to={`/pokedex/${pokemon.id - 1}`}
              className="text-lg bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
            >
              &larr; Prev
            </Link>
          ) : (
            <div />
          )}
          {pokemon.id < 151 ? (
            <Link
              to={`/pokedex/${pokemon.id + 1}`}
              className="text-lg bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
            >
              Next &rarr;
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}

export default PokemonDetail;
