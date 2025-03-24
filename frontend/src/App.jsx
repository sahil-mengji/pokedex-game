// App.jsx
import React, { useState, useEffect, createContext, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import "./index.css";

// Your components
import Pokedex from "./pages/Pokedex/pokedex";
import PokemonDetail from "./pages/Pokedex/pokemonDetail";
import Game from "./pages/Game/Game";
import AuthPage from "./pages/AuthPage/AuthPage";
import Header from "./components/Header/header"; // Import the header component

// Import nav items if needed in Header component
// import { navItems } from "./navData.jsx"; // Already imported in Header

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
      <CSSTransition key={location.key} timeout={300} classNames="fade">
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

  // Dark mode toggle effect
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
          {/* Render Header; Header will hide itself on /game route */}
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />

          {/* Animated Routes */}
          <AnimatedRoutes user={user} />
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
