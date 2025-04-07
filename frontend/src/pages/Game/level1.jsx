// Level1.jsx
import React, { useEffect, useState } from 'react';
import BattleSim from './BattleSim';
import axios from 'axios';

const Level1 = () => {
  const [levelData, setLevelData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/level/1`);
        setLevelData(response.data);
      } catch (err) {
        console.error("Error fetching level data:", err.response || err.message);
        setError('Error loading level data');
      }
    };
    fetchLevelData();
  }, []);

  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!levelData) return <div className="p-8">Loading level data...</div>;

  return <BattleSim levelData={levelData} levelNumber={1} />;
};

export default Level1;
