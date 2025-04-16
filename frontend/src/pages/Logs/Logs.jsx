import React, { useState, useEffect } from "react";

export default function Logs() {
	const [logs, setLogs] = useState([]);

	// Function to add a new log
	const addLog = (message) => {
		const now = new Date();
		const timestamp = `${now.getHours().toString().padStart(2, "0")}:${now
			.getMinutes()
			.toString()
			.padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
		setLogs((prevLogs) => [...prevLogs, { timestamp, message }].slice(-15)); // Keep only last 15 logs
	};

	// Function to clear all logs
	const clearLogs = () => {
		setLogs([]);
	};

	// Demo logs for display
	useEffect(() => {
		// Clear any existing logs first
		setLogs([]);

		// Add some sample logs with delay to simulate real logging
		const messages = [
			"System booting...",
			"Loading configuration files",
			"Initializing main process",
			"Connection established",
			"User authentication successful",
			"Loading resources: 25%",
			"Loading resources: 50%",
			"Loading resources: 100%",
			"System ready",
		];

		messages.forEach((msg, i) => {
			setTimeout(() => {
				addLog(msg);
			}, i * 800);
		});

		// Add demo log every 5 seconds
	}, []);

	return (
		<div className="flex flex-col items-center p-6 bg-white-100 h-[calc(100vh-80px)] w-full">
			{/* TV-style monitor */}
			<div className="bg-gray-800 rounded-lg p-4 shadow-lg w-full h-full flex-1 flex flex-col ">
				{/* Screen bezel */}
				<div className="bg-gray-900 rounded-md p-3 border-2 border-gray-700 flex-1 flex flex-col">
					{/* Monitor header */}
					<div className="flex justify-between mb-2 px-2 ">
						<div className="flex items-center">
							<div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
							<div className="text-xs text-green-400 font-bold">
								TERMINAL MONITOR
							</div>
						</div>
						<div className="text-xs text-green-400 ">
							{new Date().toLocaleDateString()}
						</div>
					</div>

					{/* Screen */}
					<div className="bg-black border border-gray-700 p-3 rounded shadow-inner overflow-hidden font-mono h-64 flex-1">
						<div className="text-sm text-green-500 mb-2 font-bold border-b border-green-900 pb-1 flex justify-between">
							<span>SYSTEM LOG MONITOR v1.0</span>
							<span className="animate-pulse">◉ RECORDING</span>
						</div>
						<div className="h-48 overflow-y-auto">
							{logs.length === 0 ? (
								<div className="text-green-500 text-sm animate-pulse">
									Waiting for log entries...
								</div>
							) : (
								logs.map((log, index) => (
									<div
										key={index}
										className="text-sm text-green-500 mb-1 font-mono border-b border-green-900 border-opacity-30 pb-1"
									>
										<span className="mr-2">[{log.timestamp}]</span>
										<span>{log.message}</span>
									</div>
								))
							)}
						</div>
					</div>
				</div>

				{/* Controls */}
				<div className="mt-4 flex justify-between px-2">
					<div className="text-xs text-green-400">
						Total logs: {logs.length}
					</div>
					<div className="flex gap-2">
						<button
							onClick={() => addLog("Manual entry added")}
							className="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-1 text-sm font-bold transition-colors"
						>
							Add Log
						</button>
						<button
							onClick={clearLogs}
							className="bg-red-600 hover:bg-red-700 text-white rounded px-3 py-1 text-sm font-bold transition-colors"
						>
							Clear Logs
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
