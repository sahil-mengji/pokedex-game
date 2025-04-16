import React, { useState, useRef, useEffect } from "react";

const ChatBox = ({ messages, onSendMessage, currentUserId }) => {
	const [inputMessage, setInputMessage] = useState("");
	const messagesEndRef = useRef(null);

	// Auto scroll to bottom of messages
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!inputMessage.trim()) return;

		onSendMessage(inputMessage);
		setInputMessage("");
	};

	return (
		<div className="w-[400px] h-full flex flex-col rounded-lg shadow-lg bg-gray-200 border-8 border-gray-700 font-mono">
			{/* Gameboy screen area with the classic green tint */}
			<div className="flex-1 p-3 bg-gray-800 text-center relative flex flex-col">
				<div className="h-6 w-6 absolute top-2 left-2 rounded-full bg-red-500 shadow-inner ring-2 ring-red-700"></div>
				<div className="font-bold text-xl text-green-400 mb-1">
					POKE WalkyTalky
				</div>
				<div className="text-xs text-green-400 mb-2">™ CHAT SYSTEM</div>

				{/* Screen with the classic greenish tint */}
				<div className="flex-1 bg-olive-green p-2 border-4 border-gray-900 rounded-sm shadow-inner flex flex-col">
					<div className="flex-1  overflow-y-auto p-2 bg-green-100 text-green-900">
						{messages.map((msg) => (
							<div
								key={msg.id}
								className={`mb-3 flex flex-col ${
									msg.sender === currentUserId ? "items-end" : "items-start"
								}`}
							>
								<div className="text-xs mb-1 text-green-800 font-bold">
									{msg.sender === currentUserId ? "YOU" : msg.senderName}
								</div>
								<div
									className={`px-3 py-1 rounded-md max-w-[80%] break-words ${
										msg.sender === currentUserId
											? "bg-green-200 border border-green-800"
											: "bg-green-300 border border-green-800"
									}`}
								>
									{msg.text}
								</div>
							</div>
						))}
						<div ref={messagesEndRef} />
					</div>
				</div>
			</div>

			{/* Gameboy controls area */}
			<div className="h-48 bg-gray-200 p-4">
				{/* D-pad design above the input */}
				<div className="flex justify-between mb-4">
					<div className="flex flex-col items-center">
						<div className="w-16 h-16 relative">
							<div className="absolute bg-gray-800 w-10 h-4 top-6 left-3"></div>
							<div className="absolute bg-gray-800 w-4 h-10 top-3 left-6"></div>
						</div>
						<span className="text-xs text-gray-700 mt-1">D-PAD</span>
					</div>

					<div className="flex flex-col items-center">
						<div className="flex gap-2">
							<div className="w-8 h-8 bg-gray-800 rounded-full"></div>
							<div className="w-8 h-8 bg-gray-800 rounded-full"></div>
						</div>
						<div className="text-xs text-gray-700 mt-2 text-center">
							<span className="mr-6">A</span>
							<span>B</span>
						</div>
					</div>
				</div>

				{/* Input and send button */}
				<form onSubmit={handleSubmit} className="flex mt-2">
					<input
						type="text"
						value={inputMessage}
						onChange={(e) => setInputMessage(e.target.value)}
						placeholder="Type..."
						className="flex-1 px-3 py-2 border-4 border-gray-700 bg-green-100 text-green-900 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-800"
					/>
					<button
						type="submit"
						className="bg-gray-700 hover:bg-gray-800 text-white font-bold px-4 py-2 rounded-r-md transition-all duration-200"
					>
						SEND
					</button>
				</form>
			</div>

			{/* Gameboy bottom area with speaker holes */}
			<div className="p-2 bg-gray-200 flex justify-end">
				<div className="w-16 h-4 flex space-x-1">
					{[...Array(6)].map((_, i) => (
						<div key={i} className="w-1 h-4 bg-gray-700 rounded-sm"></div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ChatBox;
