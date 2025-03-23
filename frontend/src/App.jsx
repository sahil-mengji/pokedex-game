// App.jsx
import React, { useState, useEffect, createContext, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  NavLink,
  useLocation,
} from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { FaMoon, FaSun } from "react-icons/fa";

import "./index.css";

// Your components
import Pokedex from "./pokedex";
import PokemonDetail from "./pokemonDetail";
import Game from "./Game";
import AuthPage from "./AuthPage";

// Import nav items
import { navItems } from "./navData.jsx";

// Example Home component
function Home() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Welcome to PokéGame!</h2>
      <p>This is the Home page. Use the navigation above to explore.</p>
    </div>
  );
}

const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);

// Handles the animated route transitions
function AnimatedRoutes({ user }) {
  const location = useLocation();
  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        timeout={300}
        classNames="fade"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/pokedex" element={<Pokedex />} />
          <Route path="/pokedex/:id" element={<PokemonDetail />} />
          <Route path="/auth" element={<AuthPage />} />
          {/* Protected route for Game */}
          <Route
            path="/game"
            element={user ? <Game user={user} /> : <Navigate to="/auth" replace />}
          />
          {/* Fallback */}
          <Route
            path="*"
            element={<Navigate to={user ? "/game" : "/auth"} replace />}
          />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [rehydrated, setRehydrated] = useState(false);

  // Rehydrate user session from localStorage and validate it
  useEffect(() => {
    async function validateSession() {
      const storedUser = localStorage.getItem("trainer");
      const token = localStorage.getItem("token");
      if (storedUser && token) {
        try {
          const response = await fetch("http://localhost:5000/api/validate", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          });
          const data = await response.json();
          if (data.success) {
            setUser(data.user);
          } else {
            localStorage.removeItem("trainer");
            localStorage.removeItem("token");
            setUser(null);
          }
        } catch (error) {
          console.error("Validation error:", error);
          localStorage.removeItem("trainer");
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setRehydrated(true);
    }
    validateSession();
  }, []);

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  if (!rehydrated) return <div>Loading...</div>;

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          {/* Header */}
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

            {/* Centered Nav in a fixed-width container */}
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

          {/* Animated Routes */}
          <AnimatedRoutes user={user} />
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
