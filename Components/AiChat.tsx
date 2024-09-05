import React, { useState, useEffect, useCallback } from 'react';
import { MdSpeaker, MdContentCopy, MdPause } from 'react-icons/md';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ChatScreenProps {
    userId?: string; // Optionally pass a userId to track the user (if needed)
}

const ChatScreen: React.FC<ChatScreenProps> = ({ userId }) => {
    const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [genAI, setGenAI] = useState<GoogleGenerativeAI | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [speaking, setSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [copyMessage, setCopyMessage] = useState('');

    // Initialize Google Gemini AI API
    async function initializeGeminiAPI() {
        const API_KEY = 'gemniapi; // Replace with actual API key
        const genAIInstance = new GoogleGenerativeAI(API_KEY);
        setGenAI(genAIInstance);
    }

    // Function to handle sending messages
    const handleSendMessage = useCallback(async () => {
        console.log("Sending message:", inputValue);
        console.log("Current messages state:", messages);

        if (!genAI) {
            await initializeGeminiAPI();
        }

        const message = inputValue.trim();
        if (message !== '') {
            setMessages(prevMessages => [...prevMessages, { text: message, isUser: true }]);
            setInputValue('');
            setLoading(true);

            if (genAI) {
                try {
                    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                    const result = await model.generateContent(message);
                    const response = await result.response;
                    const text = await response.text();
                    setLoading(false);
                    setMessages(prevMessages => [...prevMessages, { text, isUser: false }]);
                } catch (error) {
                    console.error("Error generating content:", error);
                    setLoading(false);
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { text: "An error occurred while generating response.", isUser: false },
                    ]);
                }
            }
        }
    }, [genAI, inputValue, messages]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleSendMessage();
            } else if (event.key === 'Enter' && event.shiftKey) {
                setInputValue(prevValue => prevValue + '\n');
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleSendMessage, setInputValue]);

    const handleCopyText = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopyMessage('Response copied!');
        setTimeout(() => setCopyMessage(''), 2000); // Clear message after 2 seconds
    };

    const handleTextToSpeech = (text: string) => {
        speechSynthesis.cancel(); // Stop any ongoing speech
        const utterance = new SpeechSynthesisUtterance(text);

        setSpeaking(true); // Start the wave animation
        utterance.onend = () => setSpeaking(false); // Stop animation when speech ends

        speechSynthesis.speak(utterance);
    };

    const handlePauseSpeech = () => {
        if (speechSynthesis.speaking) {
            speechSynthesis.pause();
            setSpeaking(false); // Pause the wave animation
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-b from-purple-900 to-black text-white">
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} items-end mb-4`}
                    >
                        <div
                            className={`bg-gray-800 p-2 rounded-lg max-w-md ${msg.isUser ? 'bg-blue-500' : ''}`}
                        >
                            {msg.text}
                        </div>
                        {!msg.isUser && (
                            <div className="flex ml-2">
                                <button
                                    className="text-blue-500"
                                    onClick={() => handleTextToSpeech(msg.text)}
                                >
                                    <MdSpeaker />
                                </button>
                                <button
                                    className="text-blue-500 ml-2"
                                    onClick={() => handleCopyText(msg.text)}
                                >
                                    <MdContentCopy />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {loading && (
                <div className="flex items-center justify-center p-4">
                    <div className="bg-gray-800 p-2 rounded-lg max-w-md">
                        AI is typing...
                    </div>
                </div>
            )}
            <div className="flex items-center justify-center p-4">
                <textarea
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none bg-gray-800 text-white resize-none"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-md"
                    onClick={handleSendMessage}
                >
                    Send
                </button>
            </div>

            {/* Show "response copied" message */}
            {copyMessage && (
                <div className="text-center text-green-500 p-4">
                    {copyMessage}
                </div>
            )}

            {/* Show animation when speaking */}
            {speaking && (
                <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 text-blue-500 animate-pulse">
                    <span>🔊 Audio Playing...</span>
                </div>
            )}

            {/* Pause button when speaking */}
            {speaking && (
                <button
                    className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md"
                    onClick={handlePauseSpeech}
                >
                    <MdPause /> Pause
                </button>
            )}
        </div>
    );
};

export default ChatScreen;
