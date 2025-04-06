import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";
import { useUser } from "../../App";

const AuthPage = () => {
	const { user } = useUser();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("login");
	const [poweredOn, setPoweredOn] = useState(false);

	// Redirect to /game if user is already logged in
	useEffect(() => {
		if (user) {
			navigate("/game", { replace: true });
		}
	}, [user, navigate]);

	// Power-on animation effect
	useEffect(() => {
		// Simulate GameBoy boot sequence
		const timer = setTimeout(() => {
			setPoweredOn(true);
		}, 1500);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
			{/* GameBoy Outer Case */}
			<div className="relative w-full max-w-md">
				{/* Top light indicator */}
				<div className="absolute -top-4 left-6 w-4 h-4 rounded-full bg-red-600 shadow-inner border border-red-700 z-10">
					<div
						className={`absolute inset-0.5 rounded-full ${
							poweredOn ? "bg-red-400" : "bg-red-800"
						} animate-pulse`}
					></div>
				</div>

				{/* GameBoy casing with texture */}
				<div className="bg-gray-300 rounded-xl p-6 shadow-lg transform perspective-1000 rotate-x-2 relative overflow-hidden">
					{/* Texture overlay for plastic look */}
					<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/10 pointer-events-none"></div>

					{/* Screen bezel */}
					<div className="bg-gray-800 rounded-lg mb-6 p-4 shadow-inner border-t border-r border-gray-900 border-b-2 border-l-2">
						{/* Screen frame */}
						<div className="bg-gray-700 rounded-md p-2 shadow-inner">
							{/* Screen with scanlines effect */}
							<div
								className={`bg-gray-800 rounded p-4 shadow-inner overflow-hidden relative ${
									poweredOn ? "opacity-100" : "opacity-0"
								} transition-opacity duration-1000`}
							>
								{/* Scanlines effect */}
								<div className="absolute inset-0 bg-scanlines opacity-10 pointer-events-none"></div>

								{/* Screen content with GameBoy-style green tint */}
								<div className="bg-green-900/90 relative p-4 rounded shadow-inner min-h-64">
									<div className="flex justify-center mb-4">
										<button
											className={`px-4 py-2 mx-1 rounded font-pixel text-sm transition-all duration-200 ${
												activeTab === "login"
													? "bg-green-400 text-green-900 shadow-md transform -translate-y-1"
													: "bg-green-700 text-green-300 shadow-inner"
											}`}
											onClick={() => setActiveTab("login")}
										>
											LOGIN
										</button>
										<button
											className={`px-4 py-2 mx-1 rounded font-pixel text-sm transition-all duration-200 ${
												activeTab === "register"
													? "bg-green-400 text-green-900 shadow-md transform -translate-y-1"
													: "bg-green-700 text-green-300 shadow-inner"
											}`}
											onClick={() => setActiveTab("register")}
										>
											REGISTER
										</button>
									</div>
									{activeTab === "login" ? <LoginForm /> : <RegistrationForm />}
								</div>
							</div>
						</div>
					</div>

					{/* D-pad and buttons area */}
					<div className="flex justify-between items-center">
						{/* D-pad */}
						<div className="relative w-24 h-24">
							<div className="absolute inset-0 bg-gray-900 rounded-full shadow-inner"></div>
							<div className="absolute left-8 top-0 w-8 h-8 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 rounded-md transform rotate-45 shadow-md"></div>
							<div className="absolute left-0 top-8 w-8 h-8 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 rounded-md transform rotate-45 shadow-md"></div>
							<div className="absolute left-8 bottom-0 w-8 h-8 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 rounded-md transform rotate-45 shadow-md"></div>
							<div className="absolute right-0 top-8 w-8 h-8 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 rounded-md transform rotate-45 shadow-md"></div>
							<div className="absolute left-8 top-8 w-8 h-8 bg-gray-800 rounded-sm"></div>
						</div>

						{/* A/B buttons */}
						<div className="relative">
							<div className="flex space-x-4">
								<button className="w-12 h-12 bg-red-600 hover:bg-red-500 active:bg-red-700 rounded-full shadow-lg transform hover:scale-105 active:scale-95 transition-transform">
									B
								</button>
								<button className="w-12 h-12 bg-red-600 hover:bg-red-500 active:bg-red-700 rounded-full shadow-lg transform hover:scale-105 active:scale-95 transition-transform">
									A
								</button>
							</div>
						</div>
					</div>

					{/* Start/Select buttons */}
					<div className="flex justify-center mt-6 space-x-8">
						<button className="w-16 h-6 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 rounded-pill shadow-md transform hover:scale-105 active:scale-95 transition-transform rotate-6">
							<span className="text-xs text-gray-400">SELECT</span>
						</button>
						<button className="w-16 h-6 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 rounded-pill shadow-md transform hover:scale-105 active:scale-95 transition-transform rotate-6">
							<span className="text-xs text-gray-400">START</span>
						</button>
					</div>

					{/* Speaker grills */}
					<div className="absolute bottom-4 right-8">
						<div className="flex space-x-1">
							{[...Array(6)].map((_, i) => (
								<div
									key={i}
									className="w-1 h-10 bg-gray-700 rounded-full"
								></div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* GameBoy Logo */}
			<div className="mt-6 text-center">
				<h2 className="font-pixel text-lg text-gray-400">PokeDEX Game </h2>
				<p className="text-sm text-gray-500 mt-1">
					© 2025 , Sahil , Ayushman , Atharva , Himanshu
				</p>
			</div>
		</div>
	);
};

// Add this to your CSS
const styleElement = document.createElement("style");
styleElement.textContent = `
  @font-face {
    font-family: 'PixelFont';
    src: url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  }
  
  .font-pixel {
    font-family: 'PixelFont', monospace;
    letter-spacing: 0.1em;
  }
  
  .bg-scanlines {
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15),
      rgba(0, 0, 0, 0.15) 1px,
      transparent 1px,
      transparent 2px
    );
  }
  
  .perspective-1000 {
    perspective: 1000px;
  }
  
  .rotate-x-2 {
    transform: rotateX(2deg);
  }
  
  .rounded-pill {
    border-radius: 999px;
  }
`;
document.head.appendChild(styleElement);

export default AuthPage;
