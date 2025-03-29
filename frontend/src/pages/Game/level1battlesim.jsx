import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Level1BattleSim = () => {
  // Load level 1 data from backend (this includes trainers & boss info)
  const [levelData, setLevelData] = useState(null);
  const [currentBattleIndex, setCurrentBattleIndex] = useState(0); // 0-4: normal battles, 5: boss battle
  const [battleOutcome, setBattleOutcome] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Assume these initial Pokemon objects come from your user selection/starter process
  // (For testing, we're hardcoding them here)
  const [userPokemon, setUserPokemon] = useState({
    pokemon_id: 25,
    nickname: "Pikachu",
    level: 5,
    max_hp: 35,
    current_hp: 35,
    attack: 55,
    defense: 40,
    speed: 90,
    special_atk: 50,
    special_def: 50,
    status: "Healthy",
    types: ["Electric"],
    moves: [
      {
        move_id: 11,
        name: "Thunderbolt",
        power: 90,
        accuracy: 1.0,
        move_type: "Electric",
        status_effect: null,
        effect_chance: null
      },
      {
        move_id: 12,
        name: "Quick Attack",
        power: 40,
        accuracy: 1.0,
        move_type: "Normal",
        status_effect: null,
        effect_chance: null
      }
    ]
  });
  
  // We'll assume the opponent for the current battle is loaded from levelData.
  // For testing, we can set initial opponent in state after data load.
  const [trainerPokemon, setTrainerPokemon] = useState(null);
  
  // User selected move (from their Pokemon's moves)
  const [selectedMove, setSelectedMove] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/level/1')
      .then(response => {
        setLevelData(response.data);
        // Set the first battle's opponent from levelData (use trainer with index 0)
        if (response.data.trainers && response.data.trainers.length > 0) {
          // Convert the JSON object to match our Pokemon model (if needed)
          setTrainerPokemon(response.data.trainers[0].pokemon[0]);
        }
      })
      .catch(err => {
        console.error("Error fetching level data:", err.response || err.message);
        setError('Error loading level data');
      });
  }, []);

  // Function to call /calculate_damage/ endpoint to calculate damage for an attack.
  const calculateDamage = async (attacker, defender, move) => {
    try {
      const payload = {
        attacker: attacker,
        defender: defender,
        move: move
      };
      const response = await axios.post("http://localhost:8000/calculate_damage/", payload);
      return response.data;
    } catch (err) {
      console.error("Error calculating damage:", err.response || err.message);
      setError("Error calculating damage");
      return null;
    }
  };

  // Simulate one turn of battle: user attacks with chosen move, then bot responds randomly.
  const simulateTurn = async () => {
    if (!selectedMove) {
      setError("Please select a move before fighting.");
      return;
    }
    setLoading(true);
    setError("");
    let log = [];
    
    // --- User's Turn ---
    const userAttackResult = await calculateDamage(userPokemon, trainerPokemon, selectedMove);
    if (!userAttackResult) {
      setLoading(false);
      return;
    }
    const userDamage = userAttackResult.damage;
    const newTrainerHP = Math.max(trainerPokemon.current_hp - userDamage, 0);
    log.push(`${userPokemon.nickname} used ${selectedMove.name} and dealt ${userDamage} damage!`);
    
    let updatedTrainer = { ...trainerPokemon, current_hp: newTrainerHP };
    // Check if opponent fainted
    if (newTrainerHP <= 0) {
      log.push(`${trainerPokemon.nickname} fainted!`);
      setTrainerPokemon(updatedTrainer);
      setBattleLog(prev => [...prev, `--- Turn ${Date.now()} ---`, ...log]);
      setBattleOutcome({ outcome: "win", winner: userPokemon.nickname });
      setLoading(false);
      return;
    }
    
    // --- Trainer's Turn ---
    const randomMove = updatedTrainer.moves[Math.floor(Math.random() * updatedTrainer.moves.length)];
    const trainerAttackResult = await calculateDamage(updatedTrainer, userPokemon, randomMove);
    if (!trainerAttackResult) {
      setLoading(false);
      return;
    }
    const trainerDamage = trainerAttackResult.damage;
    const newUserHP = Math.max(userPokemon.current_hp - trainerDamage, 0);
    log.push(`${updatedTrainer.nickname} used ${randomMove.name} and dealt ${trainerDamage} damage!`);
    
    let updatedUser = { ...userPokemon, current_hp: newUserHP };
    setUserPokemon(updatedUser);
    setTrainerPokemon(updatedTrainer);
    setBattleLog(prev => [...prev, `--- Turn ${Date.now()} ---`, ...log]);
    
    // Check if user's Pokemon fainted
    if (newUserHP <= 0) {
      log.push(`${userPokemon.nickname} fainted! You lose!`);
      setBattleOutcome({ outcome: "lose", winner: updatedTrainer.nickname });
    }
    
    setLoading(false);
  };

  // Function to handle moving to the next battle or restarting the level
  const handleNext = () => {
    // If user won, advance to next battle; if lost, restart Level 1.
    if (battleOutcome && battleOutcome.outcome === "win") {
      // Advance battle index and update trainerPokemon accordingly
      const nextIndex = currentBattleIndex + 1;
      if (nextIndex < levelData.trainers.length) {
        setCurrentBattleIndex(nextIndex);
        setTrainerPokemon(levelData.trainers[nextIndex].pokemon[0]);
      } else {
        // All normal battles done; now set boss as opponent.
        setCurrentBattleIndex(levelData.trainers.length);
        setTrainerPokemon(levelData.boss.pokemon[0]);
      }
    } else {
      // Restart level: reset battle index and HP values to original from levelData.
      setCurrentBattleIndex(0);
      if (levelData.trainers && levelData.trainers.length > 0) {
        setTrainerPokemon(levelData.trainers[0].pokemon[0]);
      }
      // Reset user Pokemon HP to original (for demo, using initialUserPokemon hardcoded values)
      // In a full implementation, you'd store the original values separately.
      setUserPokemon(initialUserPokemon);
    }
    setBattleLog([]);
    setBattleOutcome(null);
    setSelectedMove(null);
  };

  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!levelData || !trainerPokemon) return <div className="p-8">Loading battle data...</div>;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-4">
        Level 1 Battle {currentBattleIndex < levelData.trainers.length ? currentBattleIndex + 1 : 'Boss'}
      </h2>
      <div className="flex justify-around mb-4">
        <div className="p-4 border rounded">
          <h3 className="font-bold">{userPokemon.nickname} (Lv. {userPokemon.level})</h3>
          <p>HP: {userPokemon.current_hp}/{userPokemon.max_hp}</p>
          <p className="mt-2 font-medium">Your Moves:</p>
          <ul>
            {userPokemon.moves.map((move) => (
              <li key={move.move_id}>
                <button
                  className={`border px-2 py-1 rounded mb-1 ${
                    selectedMove && selectedMove.move_id === move.move_id ? 'bg-green-300' : ''
                  }`}
                  onClick={() => setSelectedMove(move)}
                  disabled={loading}
                >
                  {move.name} (Power: {move.power}, Accuracy: {move.accuracy})
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-bold">{trainerPokemon.nickname} (Lv. {trainerPokemon.level})</h3>
          <p>HP: {trainerPokemon.current_hp}/{trainerPokemon.max_hp}</p>
          <p className="mt-2 font-medium">Moves:</p>
          <ul>
            {trainerPokemon.moves.map((move) => (
              <li key={move.move_id}>{move.name}</li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={simulateTurn}
        disabled={loading || userPokemon.current_hp <= 0 || trainerPokemon.current_hp <= 0}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        {loading ? 'Battling...' : 'Fight!'}
      </button>

      {battleLog.length > 0 && (
        <div className="mt-4 border p-4 rounded bg-gray-50 max-h-60 overflow-y-auto">
          {battleLog.map((entry, index) => (
            <p key={index} className="text-sm">{entry}</p>
          ))}
        </div>
      )}

      {(userPokemon.current_hp <= 0 || trainerPokemon.current_hp <= 0) && (
        <button
          onClick={handleNext}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          {battleOutcome?.outcome === 'win' ? 'Next Battle' : 'Restart Level'}
        </button>
      )}
    </div>
  );
};

export default Level1BattleSim;
