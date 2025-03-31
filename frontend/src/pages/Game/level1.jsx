import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../App'; // import your context hook
import { useNavigate } from 'react-router-dom';

const TRAINER_API = "http://localhost:5000";
const LEVEL_API = "http://localhost:8000";
const DAMAGE_ENDPOINT = `${LEVEL_API}/calculate_damage/`;

const Level1BattleSim = () => {
  // Pull the user from context, which should contain trainer info including the id.
  const { user } = useUser();
  const trainerId = user?.trainer_id; // Assumes your user object has trainer_id

  const [userPokemon, setUserPokemon] = useState(null);
  const [trainerPokemon, setTrainerPokemon] = useState(null);
  const [levelData, setLevelData] = useState(null);
  const [battleOutcome, setBattleOutcome] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMove, setSelectedMove] = useState(null);

  const navigate = useNavigate();

  // Function to fetch trainer data.
  const fetchTrainerData = async () => {
    if (!trainerId) {
      setError('Trainer ID not found.');
      return;
    }
    try {
      const response = await axios.get(`${TRAINER_API}/trainer/${trainerId}/data`);
      const trainerData = response.data;
      if (trainerData?.pokemon?.length > 0) {
        setUserPokemon(trainerData.pokemon[0]);
        setError('');
      } else {
        setError('No Pokémon found for this trainer.');
      }
    } catch (err) {
      console.error("Error fetching trainer data:", err.response || err.message);
      setError('Error loading trainer data');
    }
  };

  // Function to fetch level data.
  const fetchLevelData = async () => {
    try {
      const response = await axios.get(`${LEVEL_API}/level/1`);
      setLevelData(response.data);
      if (response.data?.trainers?.length > 0 && response.data.trainers[0].pokemon?.length > 0) {
        setTrainerPokemon(response.data.trainers[0].pokemon[0]);
        setError('');
      } else {
        setError('No trainers found in level data.');
      }
    } catch (err) {
      console.error("Error fetching level data:", err.response || err.message);
      setError('Error loading level data');
    }
  };

  // Initial data fetching.
  useEffect(() => {
    fetchTrainerData();
    fetchLevelData();
  }, [trainerId]); // re-run if trainerId changes

  // Function to call /calculate_damage/ for damage calculation.
  const calculateDamage = async (attacker, defender, move) => {
    const payload = {
      attacker: { ...attacker },
      defender: { ...defender },
      move: { ...move }
    };

    try {
      const response = await axios.post(DAMAGE_ENDPOINT, payload);
      return response.data;
    } catch (err) {
      console.error("Error calculating damage:", err.response ? err.response.data : err.message);
      setError("Error calculating damage");
      return null;
    }
  };

  // Function to simulate one turn of battle.
  const simulateTurn = async () => {
    if (!selectedMove) {
      setError("Please select a move before fighting.");
      return;
    }
    setLoading(true);
    setError("");
    let logEntries = [];

    // --- User's Turn ---
    const timestampUser = new Date().toLocaleTimeString();
    const userAttackResult = await calculateDamage(userPokemon, trainerPokemon, selectedMove);
    if (!userAttackResult) {
      setLoading(false);
      return;
    }
    const userDamage = userAttackResult.damage;
    const newTrainerHP = Math.max(trainerPokemon.current_hp - userDamage, 0);
    logEntries.push(`${timestampUser} - ${userPokemon.nickname} used ${selectedMove.name} and dealt ${userDamage} damage!`);

    const updatedTrainer = { ...trainerPokemon, current_hp: newTrainerHP };
    if (newTrainerHP <= 0) {
      logEntries.push(`${new Date().toLocaleTimeString()} - ${trainerPokemon.nickname} fainted!`);
      setTrainerPokemon(updatedTrainer);
      setBattleLog(prevLog => [...prevLog, ...logEntries]);
      setBattleOutcome({ outcome: "win", winner: userPokemon.nickname });
      setLoading(false);
      return;
    }

    // --- Trainer's Turn ---
    if (!updatedTrainer.moves || updatedTrainer.moves.length === 0) {
      setError("Trainer has no moves to attack with.");
      setLoading(false);
      return;
    }
    const randomMove = updatedTrainer.moves[Math.floor(Math.random() * updatedTrainer.moves.length)];
    const timestampTrainer = new Date().toLocaleTimeString();
    const trainerAttackResult = await calculateDamage(updatedTrainer, userPokemon, randomMove);
    if (!trainerAttackResult) {
      setLoading(false);
      return;
    }
    const trainerDamage = trainerAttackResult.damage;
    const newUserHP = Math.max(userPokemon.current_hp - trainerDamage, 0);
    logEntries.push(`${timestampTrainer} - ${updatedTrainer.nickname} used ${randomMove.name} and dealt ${trainerDamage} damage!`);

    const updatedUser = { ...userPokemon, current_hp: newUserHP };
    setUserPokemon(updatedUser);
    setTrainerPokemon(updatedTrainer);
    setBattleLog(prevLog => [...prevLog, ...logEntries]);

    if (newUserHP <= 0) {
      setBattleOutcome({ outcome: "lose", winner: updatedTrainer.nickname });
    }
    setLoading(false);
  };

  // Restart the battle by resetting state and refetching data.
  const restartBattle = () => {
    setBattleLog([]);
    setBattleOutcome(null);
    setSelectedMove(null);
    fetchTrainerData();
    fetchLevelData();
  };

  // UI: Show loading state or error message.
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!userPokemon || !trainerPokemon) return <div className="p-8">Loading battle data...</div>;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-4">Battle Simulation</h2>
      <div className="flex justify-around mb-4">
        {/* User's Pokémon Info */}
        <div className="p-4 border rounded">
          <h3 className="font-bold">{userPokemon.nickname} (Lv. {userPokemon.level})</h3>
          <p>HP: {userPokemon.current_hp}/{userPokemon.max_hp}</p>
          <h4 className="mt-2 font-medium">Your Moves:</h4>
          <ul>
            {userPokemon?.moves?.map((move) => (
              <li key={move.move_id}>
                <button
                  className={`border px-2 py-1 rounded mb-1 ${selectedMove?.move_id === move.move_id ? 'bg-green-300' : ''}`}
                  onClick={() => setSelectedMove(move)}
                  disabled={loading}
                >
                  {move.name} (Power: {move.power}, Accuracy: {move.accuracy})
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* Opponent's Pokémon Info */}
        <div className="p-4 border rounded">
          <h3 className="font-bold">{trainerPokemon.nickname} (Lv. {trainerPokemon.level})</h3>
          <p>HP: {trainerPokemon.current_hp}/{trainerPokemon.max_hp}</p>
          <h4 className="mt-2 font-medium">Moves:</h4>
          <ul>
            {trainerPokemon?.moves?.map((move) => (
              <li key={move.move_id}>{move.name}</li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={simulateTurn}
        disabled={
          loading ||
          userPokemon.current_hp <= 0 ||
          trainerPokemon.current_hp <= 0 ||
          !selectedMove
        }
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
          onClick={restartBattle}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Restart Battle
        </button>
      )}

      {battleOutcome && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="text-xl font-bold">
            {battleOutcome.outcome === "win"
              ? `Victory! ${battleOutcome.winner} wins the battle!`
              : `Defeat! ${battleOutcome.winner} wins the battle!`}
          </h3>
        </div>
      )}
    </div>
  );
};

export default Level1BattleSim;
