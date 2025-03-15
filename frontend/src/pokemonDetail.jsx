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


function PokemonDetail() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [primaryTypeColor, setPrimaryTypeColor] = useState("#cccccc");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        // Use the backend endpoint instead of the external API.
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
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }
  if (error || !pokemon) {
    return <div className="text-center mt-10">{error || "Error loading data."}</div>;
  }

  // Convert stats object to an array for rendering.
  const statsArray = Object.entries(pokemon.stats).map(([key, value]) => ({
    name: key,
    base_stat: value,
  }));

  return (
    <div
      className="min-h-screen p-4"
      style={{
        backgroundColor: primaryTypeColor,
        backgroundImage:
          "repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0 20px, transparent 20px 40px)",
      }}
    >
      {/* Main Content Container */}
      <div className="bg-gray-200/95 backdrop-blur-md p-4 rounded-xl shadow-xl max-w-5xl mx-auto">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold capitalize text-gray-900">
            {pokemon.name} #{String(pokemon.id).padStart(4, "0")}
          </h1>
        </div>

        {/* Flavor Text */}
        {pokemon.details?.flavor_text && (
          <p className="max-w-xl mx-auto text-center text-gray-800 italic mb-6">
            {pokemon.details.flavor_text}
          </p>
        )}

        {/* Profile & Image */}
        <div className="flex flex-col md:flex-row gap-4 items-start justify-center mb-6">
          {/* Pokémon Image */}
          <div className="md:w-1/2 flex justify-center bg-gray-300 border-2 rounded-3xl p-4">
            <img
              loading="lazy"
              src={pokemon.img_src}
              alt={pokemon.name}
              className="w-64 h-64 object-contain"
            />
          </div>

          {/* Profile Box */} 
          <div className="bg-blue-400 rounded-3xl p-6 md:w-1/2">
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              {/* Row 1: Labels */}
              <div className="font-semibold text-left text-white">Height</div>
              <div className="font-semibold text-white">Category</div>

              {/* Row 2: Values */}
              <div className="text-left text-lg">
                {pokemon.height ? pokemon.height : "—"} m
              </div>
              <div className="text-lg">
                {pokemon.details?.category || "Pokémon"}
              </div>

              {/* Row 3: Labels */}
              <div className="font-semibold text-left text-white">Weight</div>
              <div className="font-semibold text-white">Abilities</div>

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
              <div className="font-semibold text-left text-white">Gender</div>
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
          <div className="md:w-1/2 space-y-6 text-center">
            {/* Types */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Type</h2>
              <div className="flex justify-center gap-3 mt-4 flex-wrap">
                {pokemon.types.map((t) => (
                  <span
                    key={t}
                    className="px-4 py-2 rounded-full text-white font-medium"
                    style={{ backgroundColor: typeColorCodes[t.toLowerCase()] || "#ccc" }}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </span>
                ))}
              </div>
            </div>
            {/* Weaknesses */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Weaknesses</h2>
              <div className="flex justify-center gap-3 mt-4 flex-wrap">
                {pokemon.weaknesses && pokemon.weaknesses.length > 0 ? (
                  pokemon.weaknesses.map((w) => (
                    <span
                      key={w}
                      className="px-4 py-2 rounded-full text-white font-medium"
                      style={{ backgroundColor: typeColorCodes[w.toLowerCase()] || "#ccc" }}
                    >
                      {w.charAt(0).toUpperCase() + w.slice(1)}
                    </span>
                  ))
                ) : (
                  <span className="px-4 py-2 rounded-full bg-gray-400 text-white font-medium">
                    None
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Stats */}
          {/* Stats Section */}
          <div className="bg-white p-6 rounded-3xl shadow-md w-full md:w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-center">Stats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {statsArray.map((stat) => {
                  const statPercent = (stat.base_stat / MAX_STAT) * 100;
                  return (
                    <div key={stat.name} className="flex flex-col">
                      {/* Stat Name & Value */}
                      <div className="flex justify-between items-center mb-1">
                        <span className="capitalize text-gray-700 font-medium">
                          {stat.name}
                        </span>
                        <span className="font-bold text-gray-900">
                          {stat.base_stat}
                        </span>
                      </div>
                      {/* Horizontal Bar with CSS animation */}
                      <div className="w-full bg-gray-300 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-in-out animate-progress"
                          style={{ "--target-width": `${statPercent}%` }}
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
      <div className="bg-gray-200/50 backdrop-blur-md p-6 rounded-xl shadow-xl max-w-5xl mx-auto mt-6 relative z-10">
        <h2 className="text-2xl font-bold text-center mb-6">Evolutions</h2>

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

          // 1. If there's only one Pokémon in the chain, just show it
          if (chain.length === 1) {
            const single = chain[0];
            return (
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden mb-2">
                  <img
                    loading="lazy"
                    src={single.img_src}
                    alt={single.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-lg font-bold capitalize text-gray-800 text-center">
                  {single.name}
                  <div className="text-xs sm:text-sm text-gray-600">
                    #{String(single.id).padStart(4, "0")}
                  </div>
                </p>

                <div className="flex space-x-2 mt-2">
                  {single.types?.map((type) => (
                    <span
                      key={type}
                      className="px-2 py-1 text-xs text-white font-semibold rounded-full"
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
          }

          // 2. Special logic for Eevee (id = 133) => Only ONE arrow
          if (chain[0].id === 133) {
            // The first element is Eevee; the rest are its evolutions
            const eevee = chain[0];
            const evolutions = chain.slice(1);

            const EvolutionCircle = ({ evoData }) => (
              <div className="flex flex-col items-center">
                <Link key={evoData.id} to={`/pokedex/${evoData.id}`}>
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg overflow-hidden mb-2">
                    <img
                      loading="lazy"
                      src={evoData.img_src}
                      alt={evoData.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </Link>
                <p className="text-md sm:text-lg font-bold capitalize text-gray-800">
                  {evoData.name}
                  <span className="block text-xs sm:text-sm text-gray-600">
                    #{String(evoData.id).padStart(4, "0")}
                  </span>
                </p>
                <div className="flex space-x-2 mt-2">
                  {evoData.types?.map((type) => (
                    <span
                      key={type}
                      className="px-2 py-1 text-xs text-white font-semibold rounded-full"
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

            return (
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
                {/* Eevee on the left */}
                <EvolutionCircle evoData={eevee} />

                {/* ONE arrow in the middle */}
                {evolutions.length > 0 && (
                  <div className="text-4xl text-gray-500 font-bold hidden sm:block relative -mt-3">
                    &rarr;
                  </div>
                )}

                {/* All evolutions on the right (no additional arrows) */}
                <div className="flex gap-4 sm:gap-8">
                  {evolutions.map((evo) => (
                    <EvolutionCircle evoData={evo} key={evo.id} />
                  ))}
                </div>
              </div>
            );
          }

          // 3. Default case => arrow between each stage
          const EvolutionCircle = ({ evoData }) => (
            <div className="flex flex-col items-center">
              <Link key={evoData.id} to={`/pokedex/${evoData.id}`}>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg overflow-hidden mb-2">
                  <img
                    loading="lazy"
                    src={evoData.img_src}
                    alt={evoData.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </Link>
              <p className="text-md sm:text-lg font-bold capitalize text-gray-800">
                {evoData.name}
                <span className="block text-xs sm:text-sm text-gray-600">
                  #{String(evoData.id).padStart(4, "0")}
                </span>
              </p>
              <div className="flex space-x-2 mt-2">
                {evoData.types?.map((type) => (
                  <span
                    key={type}
                    className="px-2 py-1 text-xs text-white font-semibold rounded-full"
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

          return (
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
              {chain.map((poke, idx) => {
                // If this is not the last item, render the arrow after
                if (idx < chain.length - 1) {
                  return (
                    <React.Fragment key={poke.id}>
                      <EvolutionCircle evoData={poke} />
                      <div className="text-4xl text-gray-500 font-bold hidden sm:block relative -mt-3">
                        &rarr;
                      </div>
                    </React.Fragment>
                  );
                } else {
                  // If it's the last item, just render the circle
                  return <EvolutionCircle evoData={poke} key={poke.id} />;
                }
              })}
            </div>
          );
        })()}
      </div>
      
      {/* Global Navigation */}
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
