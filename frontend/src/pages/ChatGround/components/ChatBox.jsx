// src/components/ChatBox.js
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
		<div className="w-[400px] h-[600px] flex flex-col border-[3px] border-yellow-400 rounded-lg shadow-lg bg-gradient-to-br from-yellow-100 via-blue-100 to-red-100 font-pokemon">
			<div className="p-3 bg-red-500 text-white font-bold text-xl text-center border-b-4 border-yellow-400">
				🔥 Vicinity Chat 🔥
			</div>

			<div className="flex-1 overflow-y-auto p-3 bg-white">
				{messages.map((msg) => (
					<div
						key={msg.id}
						className={`mb-3 flex flex-col ${
							msg.sender === currentUserId ? "items-end" : "items-start"
						}`}
					>
						<div className="text-xs text-gray-500 mb-1">
							{msg.sender === currentUserId ? "You" : msg.senderName}
						</div>
						<div
							className={`px-4 py-2 rounded-2xl max-w-[80%] break-words ${
								msg.sender === currentUserId
									? "bg-blue-500 text-white"
									: "bg-yellow-200 text-black"
							}`}
						>
							{msg.text}
						</div>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>

			<form onSubmit={handleSubmit} className="flex p-3 border-t-2 border-yellow-300 bg-yellow-50">
				<input
					type="text"
					value={inputMessage}
					onChange={(e) => setInputMessage(e.target.value)}
					placeholder="Type a message..."
					className="flex-1 px-3 py-2 border-2 border-yellow-400 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-400"
				/>
				<button
					type="submit"
					className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-r-lg transition-all duration-200"
				>
					Send
				</button>
			</form>
		</div>
	);
};

export default ChatBox;
