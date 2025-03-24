// Header.jsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { navItems } from "../NavData/navData.jsx";

const Header = ({ darkMode, setDarkMode }) => {
  const location = useLocation();

  // Hide header on the /game route
  if (location.pathname === "/game") {
    return null;
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 transition-colors">
      {/* Top bar: logo + dark mode toggle */}
      <div className="flex items-center justify-between px-6 py-3">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
          PokéGame
        </h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center justify-center w-10 h-10 rounded-full 
                     text-gray-700 dark:text-gray-300 
                     hover:text-orange-500 hover:bg-gray-100 dark:hover:bg-gray-700 
                     transition-colors duration-300"
          title="Toggle Dark Mode"
        >
          {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
      </div>

      {/* Centered Nav */}
      <div className="mx-auto max-w-md w-full">
        <nav className="flex bg-white dark:bg-gray-800 rounded-md overflow-hidden shadow">
          {navItems.map(({ name, path, icon, color }) => (
            <div key={name} className="flex-1">
              <NavLink
                to={path}
                end
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-3 
                   transition-all duration-300 
                   ${
                     isActive
                       ? `${color} text-white scale-105`
                       : "bg-transparent text-gray-700 dark:text-gray-200 hover:scale-105"
                   }`
                }
              >
                <div className="text-xl mb-1">{icon}</div>
                <span className="text-sm font-medium leading-tight text-center">
                  {name}
                </span>
              </NavLink>
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
