import React, { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { navItems } from "../NavData/navData.jsx";

const Header = ({ darkMode, setDarkMode }) => {
	const location = useLocation();
	const headerRef = useRef(null);

	// Add 3D tilt effect on mouse movement
	// Hide header on the /game route
	if (location.pathname === "/game") {
		return null;
	}

	return (
		<header
			ref={headerRef}
			className={`${darkMode ? "gameboy-dark" : "gameboy-light"} 
                  fixed w-full z-20 transition-all duration-300 shadow-xl border-4 
                  rounded-lg  overflow-hidden`}
			style={{
				transition: "transform 0.1s ease-out",
			}}
		>
			{/* GameBoy texture overlay */}
			<div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay bg-gradient-to-br from-transparent to-black"></div>
			<div className="absolute inset-0 pointer-events-none opacity-10 bg-noise"></div>

			{/* GameBoy screen scanlines */}
			<div className="absolute inset-0 pointer-events-none opacity-5 bg-scanlines"></div>

			{/* Top bar with inset effect */}
			<div className="flex items-center justify-between px-6 py-2 border-b-4 border-gray-400 dark:border-gray-900 relative">
				{/* Logo with embossed effect */}
				<h1 className="text-2xl font-extrabold relative z-10">
					<span
						className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 
                        filter drop-shadow-lg transform translate-y-px"
					>
						PokéGame
					</span>
				</h1>

				{/* Center nav with 3D button effect */}
				<div className="mx-auto max-w-md w-full px-2">
					<nav className="flex rounded-xl shadow-inner bg-gray-300 dark:bg-gray-900">
						{navItems.map(({ name, path, icon, color }) => (
							<div key={name} className="flex-1 p-1">
								<NavLink
									to={path}
									end
									className={({ isActive }) =>
										`flex  gap-3 items-center justify-center py-2
                     transition-all duration-300 rounded-lg
                     ${
												isActive
													? `${color} text-white transform scale-105 shadow-lg`
													: "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:scale-102"
											}
                     ${isActive ? "nav-button-pressed" : "nav-button"}`
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

				{/* Toggle button with physical button effect */}
				<button
					onClick={() => setDarkMode(!darkMode)}
					className={`flex items-center justify-center w-12 h-12 rounded-full
                   text-gray-700 dark:text-gray-300
                   ${darkMode ? "toggle-button-dark" : "toggle-button-light"}
                   active:translate-y-1 active:shadow-inner
                   transition-all duration-100`}
					title="Toggle Dark Mode"
				>
					{darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
				</button>
			</div>

			{/* Style tag for custom skeuomorphic effects */}
			<style jsx>{`
				.gameboy-light {
					background-color: #e5e7eb;
					border-color: #d0d4da;
				}

				.gameboy-dark {
					background-color: #2a3a4a;
					box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.3),
						inset 3px 0 0 rgba(255, 255, 255, 0.1),
						inset -3px 0 0 rgba(0, 0, 0, 0.2), 0 10px 20px rgba(0, 0, 0, 0.4);
					border-color: #1a2a3a;
				}

				.nav-button {
					box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2),
						inset 0 1px 0 rgba(255, 255, 255, 0.7);
				}

				.nav-button-pressed {
					box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.3),
						0 1px 0 rgba(255, 255, 255, 0.4);
				}

				.toggle-button-light {
					background: linear-gradient(135deg, #e0e0e0, #f5f5f5);
					box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15),
						inset 0 1px 0 rgba(255, 255, 255, 0.7);
				}

				.toggle-button-dark {
					background: linear-gradient(135deg, #303030, #454545);
					box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25),
						inset 0 1px 0 rgba(255, 255, 255, 0.1);
				}

				.bg-noise {
					background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
				}

				.bg-scanlines {
					background: repeating-linear-gradient(
						to bottom,
						transparent 0px,
						transparent 1px,
						rgba(0, 0, 0, 0.2) 1px,
						rgba(0, 0, 0, 0.2) 2px
					);
				}
			`}</style>
		</header>
	);
};

export default Header;
