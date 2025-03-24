import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../App';
import axios from 'axios';

const Game = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [selectedStarter, setSelectedStarter] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth'); // Redirect to auth if not logged in
    }
  }, [user, navigate]);

  const starters = [
    { id: 'mankey', name: 'Mankey', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/56.png' },
    { id: 'sandshrew', name: 'Sandshrew', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/27.png' },
    { id: 'growlithe', name: 'Growlithe', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/58.png' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('trainer');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/auth', { replace: true });
  };

  const handleChooseStarter = async () => {
    if (!selectedStarter) {
      setMessage('Please select a starter Pokémon.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post('/game/choose-starter', {
        trainerId: user.id,
        chosenPokemon: selectedStarter,
      });
      setMessage(response.data.message);
      setUser({ ...user, starterChosen: true, starter: selectedStarter });
    } catch (error) {
      console.error('Error selecting starter:', error);
      setMessage('An error occurred while choosing your starter.');
    } finally {
      setLoading(false);
    }
  };

  if (!user?.starterChosen) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-500 flex flex-col items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Welcome, {user?.name}!
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 text-center">
            Please choose your starter Pokémon:
          </p>
          <div className="flex justify-around mb-6">
            {starters.map((starter) => (
              <div
                key={starter.id}
                className={`cursor-pointer transition transform hover:scale-105 p-2 border-2 rounded-lg ${
                  selectedStarter === starter.id ? 'border-green-500' : 'border-transparent'
                }`}
                onClick={() => setSelectedStarter(starter.id)}
              >
                <img src={starter.image} alt={starter.name} className="w-24 h-24 object-contain" />
                <p className="mt-2 text-center text-gray-800 dark:text-gray-200">{starter.name}</p>
              </div>
            ))}
          </div>
          <button
            onClick={handleChooseStarter}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
          >
            {loading ? 'Choosing...' : 'Choose Starter'}
          </button>
          {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-6">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-lg w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Welcome, {user.name}!
        </h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          You have successfully entered the game area.
        </p>
        <p className="mt-2 text-md text-gray-600 dark:text-gray-400">
          Gender: {user.gender}
        </p>
        <p className="mt-2 text-md text-gray-600 dark:text-gray-400">
          Starter Pokémon: {user.starter || 'Not chosen'}
        </p>
        <button
          onClick={handleLogout}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all duration-300"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Game;
