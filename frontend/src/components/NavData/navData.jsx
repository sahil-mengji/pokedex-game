// navData.jsx
import { FaHome, FaBook, FaGamepad } from "react-icons/fa";

export const navItems = [
  {
    name: "Home",
    path: "/",
    color: "bg-green-500",
    icon: <FaHome size={22} />,
  },
  {
    name: "Pokédex",
    path: "/pokedex",
    color: "bg-red-500",
    icon: <FaBook size={22} />,
  },
  {
    name: "Start Game",
    path: "/auth",
    color: "bg-blue-500",
    icon: <FaGamepad size={22} />,
  },
];
