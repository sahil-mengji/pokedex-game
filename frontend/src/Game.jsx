// Game.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './App';

const Game = ({ user }) => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear stored session data
    localStorage.removeItem('trainer');
    localStorage.removeItem('token');
    // Reset user state
    setUser(null);
    // Redirect to the authentication page
    navigate('/auth', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        Welcome, {user.name}!
      </h1>
      <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
        You have successfully entered the game area.
      </p>
      <p className="mt-2 text-md text-gray-600 dark:text-gray-400">
        Gender: {user.gender}
      </p>
      <button 
         onClick={handleLogout} 
         className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all duration-300"
      >
        Log Out
      </button>
    </div>
  );
};

export default Game;
