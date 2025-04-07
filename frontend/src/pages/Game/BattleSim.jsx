import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useUser } from '../../App';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './BattleGround.css';

const TRAINER_API = 'http://localhost:5000';
const LEVEL_API = 'http://localhost:8000';
const DAMAGE_ENDPOINT = `${LEVEL_API}/calculate_damage/`;

const BattleSim = ({ levelData, levelNumber, isEscapeAllowed = false }) => {
  const { user } = useUser();
  const trainerId = user?.trainer_id;
  const navigate = useNavigate();

  // Battle states
  const [userPokemon, setUserPokemon] = useState(null);
  const [trainerPokemon, setTrainerPokemon] = useState(null);
  const [battleOutcome, setBattleOutcome] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMove, setSelectedMove] = useState(null);
  const [hoveredMove, setHoveredMove] = useState(null);
  const [opponentMove, setOpponentMove] = useState(null);

  // Animation states
  const [playerAttacking, setPlayerAttacking] = useState(false);
  const [enemyAttacking, setEnemyAttacking] = useState(false);
  const [playerDamageEffect, setPlayerDamageEffect] = useState(false);
  const [enemyDamageEffect, setEnemyDamageEffect] = useState(false);
  const [battleStartAnimation, setBattleStartAnimation] = useState(true);

  // Menu states
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('none'); // 'player', 'enemy', or 'none'

  // Refs for battle log and sound effects
  const logRef = useRef(null);
  const battleSoundRef = useRef(null);

  // Fetch trainer data for user's Pokémon
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
      console.error('Error fetching trainer data:', err.response || err.message);
      setError('Error loading trainer data');
    }
  };

  // Initialize opponent data from levelData
  const initLevelData = () => {
    if (levelData?.trainers?.length > 0 && levelData.trainers[0].pokemon?.length > 0) {
      setTrainerPokemon(levelData.trainers[0].pokemon[0]);
      setError('');
    } else {
      setError('No trainers found in level data.');
    }
  };

  // Initial setup and battle start animation
  useEffect(() => {
    fetchTrainerData();
    initLevelData();

    const timer = setTimeout(() => {
      setBattleStartAnimation(false);
      setShowMainMenu(true);
      addLog('Battle started!');
    }, 2500);

    return () => clearTimeout(timer);
  }, [trainerId, levelData]);

  // Auto-scroll battle log when updated
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [battleLog]);

  // Play sound effects based on type
  const playSound = (soundType) => {
    if (battleSoundRef.current) {
      battleSoundRef.current.pause();
      switch (soundType) {
        case 'select':
          battleSoundRef.current.src = '/sounds/select.wav';
          break;
        case 'attack':
          battleSoundRef.current.src = '/sounds/attack.wav';
          break;
        case 'damage':
          battleSoundRef.current.src = '/sounds/damage.wav';
          break;
        case 'victory':
          battleSoundRef.current.src = '/sounds/victory.wav';
          break;
        case 'defeat':
          battleSoundRef.current.src = '/sounds/defeat.wav';
          break;
        default:
          return;
      }
      battleSoundRef.current.play().catch((e) =>
        console.error('Audio play error:', e)
      );
    }
  };

  // Log battle messages with timestamp
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setBattleLog((prevLog) => [...prevLog, `${timestamp} - ${message}`]);
  };

  // Calculate damage using API
  const calculateDamage = async (attacker, defender, move) => {
    const payload = { attacker: { ...attacker }, defender: { ...defender }, move: { ...move } };
    try {
      const response = await axios.post(DAMAGE_ENDPOINT, payload);
      return response.data;
    } catch (err) {
      console.error('Error calculating damage:', err.response ? err.response.data : err.message);
      setError('Error calculating damage');
      return null;
    }
  };

  // Handle main menu selection (only FIGHT is implemented)
  const handleMainMenuSelection = (action) => {
    playSound('select');
    if (action === 'FIGHT') {
      setShowMainMenu(false);
      setShowMoveMenu(true);
    } else {
      addLog(`${action} is not implemented yet.`);
    }
  };

  // Prepare a 2x2 grid of moves; fill with null if fewer than 4 moves exist
  const gridMoves = () => {
    const moves = userPokemon?.moves || [];
    const grid = [];
    for (let i = 0; i < 4; i++) {
      grid.push(i < moves.length ? moves[i] : null);
    }
    return grid;
  };

  // Handle move selection from the grid
  const handleSelectMove = async (move) => {
    if (!move) return;
    playSound('select');
    setSelectedMove(move);
    setShowMoveMenu(false);
    setError('');
    setCurrentTurn('player');
    setLoading(true);

    const continueBattle = await executePlayerTurn(move);
    if (continueBattle) {
      await executeEnemyTurn();
    }
    setCurrentTurn('none');
    setSelectedMove(null);
    setHoveredMove(null);
    setLoading(false);

    if (!battleOutcome) {
      setShowMainMenu(true);
    }
  };

  // Execute player's turn using the selected move
  const executePlayerTurn = async (move) => {
    setPlayerAttacking(true);
    playSound('attack');
    addLog(`${userPokemon.nickname} used ${move.name}!`);

    const userAttackResult = await calculateDamage(userPokemon, trainerPokemon, move);
    if (!userAttackResult) return false;

    await new Promise((resolve) => setTimeout(resolve, 800));
    setPlayerAttacking(false);

    const userDamage = userAttackResult.damage;
    const newTrainerHP = Math.max(trainerPokemon.current_hp - userDamage, 0);
    setTrainerPokemon((prev) => ({ ...prev, current_hp: newTrainerHP }));

    setEnemyDamageEffect(true);
    playSound('damage');
    await new Promise((resolve) => setTimeout(resolve, 500));
    setEnemyDamageEffect(false);

    addLog(`${userPokemon.nickname} dealt ${userDamage} damage!`);
    if (userAttackResult.effectiveness && userAttackResult.effectiveness !== 'normal') {
      addLog(`It's ${userAttackResult.effectiveness}!`);
    }

    if (newTrainerHP <= 0) {
      addLog(`${trainerPokemon.nickname} fainted!`);
      setBattleOutcome({ outcome: 'win', winner: userPokemon.nickname });
      playSound('victory');
      return false;
    }
    return true;
  };

  // Execute enemy turn
  const executeEnemyTurn = async () => {
    setCurrentTurn('enemy');
    if (!trainerPokemon.moves || trainerPokemon.moves.length === 0) {
      setError('Trainer has no moves!');
      return false;
    }
    const randomMove =
      trainerPokemon.moves[Math.floor(Math.random() * trainerPokemon.moves.length)];
    setOpponentMove(randomMove);
    addLog(`${trainerPokemon.nickname} used ${randomMove.name}!`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setEnemyAttacking(true);
    playSound('attack');

    const trainerAttackResult = await calculateDamage(trainerPokemon, userPokemon, randomMove);
    if (!trainerAttackResult) return false;
    await new Promise((resolve) => setTimeout(resolve, 800));
    setEnemyAttacking(false);
    setTimeout(() => setOpponentMove(null), 1500);

    const trainerDamage = trainerAttackResult.damage;
    const newUserHP = Math.max(userPokemon.current_hp - trainerDamage, 0);
    setUserPokemon((prev) => ({ ...prev, current_hp: newUserHP }));

    setPlayerDamageEffect(true);
    playSound('damage');
    await new Promise((resolve) => setTimeout(resolve, 500));
    setPlayerDamageEffect(false);

    addLog(`${trainerPokemon.nickname} dealt ${trainerDamage} damage!`);
    if (newUserHP <= 0) {
      addLog(`${userPokemon.nickname} fainted!`);
      setBattleOutcome({ outcome: 'lose', winner: trainerPokemon.nickname });
      playSound('defeat');
      return false;
    }
    return true;
  };

  // Restart the battle
  const restartBattle = () => {
    setBattleLog([]);
    setBattleOutcome(null);
    setSelectedMove(null);
    setCurrentTurn('none');
    setPlayerAttacking(false);
    setEnemyAttacking(false);
    setPlayerDamageEffect(false);
    setEnemyDamageEffect(false);
    setBattleStartAnimation(true);
    setShowMainMenu(false);
    setShowMoveMenu(false);
    setOpponentMove(null);

    fetchTrainerData();
    initLevelData();

    setTimeout(() => {
      setBattleStartAnimation(false);
      setShowMainMenu(true);
      addLog('Battle restarted!');
    }, 2500);
  };

  if (error) return <div className="error">{error}</div>;
  if (!userPokemon || !trainerPokemon)
    return <div className="loading">Loading battle data...</div>;

  // Calculate health percentages
  const trainerHealthPercent =
    (trainerPokemon.current_hp / trainerPokemon.max_hp) * 100;
  const userHealthPercent =
    (userPokemon.current_hp / userPokemon.max_hp) * 100;

  const getHealthColorClass = (percentage) => {
    if (percentage <= 25) return 'health-critical';
    if (percentage <= 50) return 'health-warning';
    return 'health-good';
  };

  // Prepare grid array of 4 moves (with blanks if needed)
  const grid = gridMoves();

  // For opponent sprite, use the Pokémon id from trainerPokemon and load from /assets/pokemonOpp
  const opponentSprite = trainerPokemon?.pokemon_id

    ? `/things/pokemonOpp/${trainerPokemon.pokemon_id}.png`

    : '/things/pokemonOpp/0.png';

  // For user Pokémon sprite, use a similar approach if desired (or use userPokemon.sprite_url)
  const userSprite = userPokemon?.sprite_url || '/assets/default-player.png';

  return (
    <div className="gba-battle-container">
      {/* Sound Effects */}
      <audio ref={battleSoundRef} />
      <div className="gba-battle-background">
        <AnimatePresence>
          {battleStartAnimation && (
            <motion.div
              className="battle-start-animation"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5 }}
            >
              <motion.div
                className="battle-flash"
                animate={{ opacity: [0, 1, 0, 1, 0], scale: [1, 1.2, 1, 1.2, 1] }}
                transition={{ duration: 1.5 }}
              />
              <motion.h2
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="battle-start-text"
              >
                A wild {trainerPokemon.nickname} appeared!
              </motion.h2>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="gba-enemy-container">
          <div className="gba-hp-box enemy-hp-box">
            <div className="gba-pokemon-name">
              {trainerPokemon.nickname}{' '}
              <span className="gba-level-text">Lv.{trainerPokemon.level}</span>
            </div>
            <div className="gba-health-container">
              <div className="gba-health-bar">
                <motion.div
                  className={`gba-health-fill ${getHealthColorClass(trainerHealthPercent)}`}
                  initial={{ width: '100%' }}
                  animate={{ width: `${trainerHealthPercent}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />
              </div>
            </div>
            {opponentMove && (
              <div className="opponent-move">Move: {opponentMove.name}</div>
            )}
          </div>
          <motion.div
            className={`gba-pokemon-sprite enemy-sprite ${enemyDamageEffect ? 'damage-effect' : ''}`}
            animate={
              enemyDamageEffect
                ? { x: [-10, 10, -10, 10, 0], opacity: [1, 0.7, 1, 0.7, 1] }
                : {}
            }
            transition={{ duration: 0.5 }}
          >
            <motion.img
              src={opponentSprite}
              alt={trainerPokemon.nickname}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: enemyAttacking ? [0, -20, 0] : 0, opacity: 1 }}
              transition={{
                x: enemyAttacking ? { duration: 0.8 } : { duration: 0.5, delay: 0.3 },
                opacity: { duration: 0.5 }
              }}
            />
          </motion.div>
        </div>
        <div className="gba-player-container">
          <motion.div
            className={`gba-pokemon-sprite player-sprite ${playerDamageEffect ? 'damage-effect' : ''}`}
            animate={
              playerDamageEffect
                ? { x: [-10, 10, -10, 10, 0], opacity: [1, 0.7, 1, 0.7, 1] }
                : {}
            }
            transition={{ duration: 0.5 }}
          >
            <motion.img
              src={userSprite}
              alt={userPokemon.nickname}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: playerAttacking ? [0, 20, 0] : 0, opacity: 1 }}
              transition={{
                x: playerAttacking ? { duration: 0.8 } : { duration: 0.5, delay: 0.8 },
                opacity: { duration: 0.5 }
              }}
            />
          </motion.div>
          <div className="gba-hp-box player-hp-box">
            <div className="gba-pokemon-name">
              {userPokemon.nickname}{' '}
              <span className="gba-level-text">Lv.{userPokemon.level}</span>
            </div>
            <div className="gba-health-container">
              <div className="gba-health-bar">
                <motion.div
                  className={`gba-health-fill ${getHealthColorClass(userHealthPercent)}`}
                  initial={{ width: '100%' }}
                  animate={{ width: `${userHealthPercent}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />
              </div>
              <div className="gba-hp-text">
                HP: {userPokemon.current_hp}/{userPokemon.max_hp}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="gba-bottom-ui">
        {battleOutcome ? (
          <div className="gba-dialog-box">
            <div className="gba-dialog-text">
              {battleOutcome.outcome === 'win'
                ? `${battleOutcome.winner} wins the battle!`
                : `${battleOutcome.winner} wins the battle!`}
            </div>
            <motion.button
              className="gba-restart-btn"
              onClick={restartBattle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Battle Again
            </motion.button>
          </div>
        ) : (
          <>
            <div className="gba-dialog-box">
              {showMoveMenu ? (
                <div className="gba-move-grid">
                  {grid.map((move, index) =>
                    move ? (
                      <button
                        key={move.move_id}
                        className={`gba-move-btn ${selectedMove?.move_id === move.move_id ? 'selected' : ''}`}
                        onClick={() => handleSelectMove(move)}
                        onMouseEnter={() => setHoveredMove(move)}
                        onMouseLeave={() => setHoveredMove(null)}
                        disabled={move.pp_current <= 0}
                      >
                        {move.name}
                      </button>
                    ) : (
                      <button key={index} className="gba-move-btn blank" disabled></button>
                    )
                  )}
                </div>
              ) : (
                <div className="gba-dialog-text">
                  {currentTurn === 'player' && selectedMove
                    ? `${userPokemon.nickname} used ${selectedMove.name}!`
                    : currentTurn === 'enemy'
                    ? `${trainerPokemon.nickname} is attacking...`
                    : `What will ${userPokemon.nickname} do?`}
                </div>
              )}
            </div>
            <div className="gba-menu-box">
              {showMoveMenu ? (
                <div className="gba-move-info">
                  {hoveredMove ? (
                    <>
                      <p><strong>{hoveredMove.name}</strong></p>
                      <p>
                        Type:{' '}
                        {hoveredMove.type && (
                          <span className={`move-type type-${hoveredMove.type.toLowerCase()}`}>
                            {hoveredMove.type}
                          </span>
                        )}
                      </p>
                      <p>PP: {hoveredMove.pp_current}/{hoveredMove.pp_total}</p>
                      <p>
                        Description:{' '}
                        {hoveredMove.description
                          ? hoveredMove.description
                          : 'No description available.'}
                      </p>
                    </>
                  ) : (
                    <p>Hover over a move for details</p>
                  )}
                </div>
              ) : (
                <div className="gba-main-menu">
                  <button onClick={() => handleMainMenuSelection('FIGHT')}>FIGHT</button>
                  <button onClick={() => handleMainMenuSelection('BAG')}>BAG</button>
                  <button onClick={() => handleMainMenuSelection('POKEMON')}>POKéMON</button>
                  {isEscapeAllowed && (
                    <button onClick={() => handleMainMenuSelection('RUN')}>RUN</button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <div className="gba-battle-log-container">
        <div className="gba-battle-log" ref={logRef}>
          {battleLog.map((entry, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {entry}
            </motion.p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattleSim;



