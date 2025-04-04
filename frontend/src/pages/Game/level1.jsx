// Level1BattleSim.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../App'; // your context hook
import { useNavigate } from 'react-router-dom';
import './BattleGround.css'; // import the CSS styles
import battleBg from './battle-bg.png'; 

const TRAINER_API = "http://localhost:5000";
const LEVEL_API = "http://localhost:8000";
const DAMAGE_ENDPOINT = `${LEVEL_API}/calculate_damage/`;

const Level1BattleSim = () => {
  const { user } = useUser();
  const trainerId = user?.trainer_id;

  const [userPokemon, setUserPokemon] = useState(null);
  const [trainerPokemon, setTrainerPokemon] = useState(null);
  const [levelData, setLevelData] = useState(null);
  const [battleOutcome, setBattleOutcome] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMove, setSelectedMove] = useState(null);

  const navigate = useNavigate();

  // Fetch trainer data.
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

  // Fetch level data.
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
  }, [trainerId]);

  // Call /calculate_damage/ for damage calculation.
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

  // Simulate one turn of battle.
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

  // Restart battle.
  const restartBattle = () => {
    setBattleLog([]);
    setBattleOutcome(null);
    setSelectedMove(null);
    fetchTrainerData();
    fetchLevelData();
  };

  // UI: Loading and error states.
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!userPokemon || !trainerPokemon) return <div className="p-8">Loading battle data...</div>;

  return (
    <div 
      className="battle-container"
      style={{
        backgroundImage: `url(${battleBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '1195px',
        height: '555px' // Ensure the element has height
      }}
    >
      {/* Background and battle scene */}
      <div className="battle-ground">
        {/* Opponent's Side */}
        <div className="battle-section opponent">
          <div className="pokemon-sprite animate-enemy">
            <img src={trainerPokemon.sprite_url || "/assets/default-opponent.png"} alt={trainerPokemon.nickname} />
          </div>
          <div className="health-bar">
            <div className="health" style={{ width: `${(trainerPokemon.current_hp / trainerPokemon.max_hp) * 100}%` }}></div>
          </div>
          <div className="pokemon-name">{trainerPokemon.nickname} (Lv. {trainerPokemon.level})</div>
        </div>

        {/* Player's Side */}
        <div className="battle-section player">
          <div className="pokemon-sprite animate-player">
            <img src={userPokemon.sprite_url || "/assets/default-player.png"} alt={userPokemon.nickname} />
          </div>
          <div className="health-bar">
            <div className="health" style={{ width: `${(userPokemon.current_hp / userPokemon.max_hp) * 100}%` }}></div>
          </div>
          <div className="pokemon-name">{userPokemon.nickname} (Lv. {userPokemon.level})</div>
        </div>
      </div>

      {/* Move selection */}
      <div className="move-selection">
        <h4>Select Your Move:</h4>
        <ul>
          {userPokemon?.moves?.map((move) => (
            <li key={move.move_id}>
              <button
                className={`move-btn ${selectedMove?.move_id === move.move_id ? 'selected' : ''}`}
                onClick={() => setSelectedMove(move)}
                disabled={loading}
              >
                {move.name} (Power: {move.power}, Acc: {move.accuracy})
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Battle action button */}
      <div className="action-panel">
        <button
          onClick={simulateTurn}
          disabled={
            loading ||
            userPokemon.current_hp <= 0 ||
            trainerPokemon.current_hp <= 0 ||
            !selectedMove
          }
          className="action-btn"
        >
          {loading ? 'Battling...' : 'Fight!'}
        </button>
        {(userPokemon.current_hp <= 0 || trainerPokemon.current_hp <= 0) && (
          <button onClick={restartBattle} className="restart-btn">
            Restart Battle
          </button>
        )}
      </div>

      {/* Battle Log */}
      <div className="battle-log">
        {battleLog.map((entry, index) => (
          <p key={index}>{entry}</p>
        ))}
      </div>

      {/* Outcome */}
      {battleOutcome && (
        <div className="battle-outcome">
          <h3>
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
