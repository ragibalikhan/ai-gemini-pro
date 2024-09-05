import React from 'react';


interface StartScreenProps {
    onNext: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onNext }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-purple-900 to-black text-white">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-4">Welcome to AI Chat Bot</h1>
                <p className="text-lg">Your friendly AI companion for all your needs!</p>
            </div>
            <img src='c.gif' alt="Chat Bot Animation" className="w-64 mb-8" /> {/* Display your chat bot animation or image */}
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={onNext}>Get Started</button>
        </div>
    );
};

export default StartScreen;
