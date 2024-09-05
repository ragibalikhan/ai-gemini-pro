import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ChatScreenProps {
    userId: string; // Pass the unique user ID
}

const ChatScreen: React.FC<ChatScreenProps> = ({ userId }) => {
    const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch the user's chat history using their unique ID
        const fetchChatHistory = async () => {
            try {
                const response = await axios.get(`/api/chat-history/${userId}`);
                setMessages(response.data.history);
            } catch (error) {
                console.error('Error fetching chat history:', error);
            }
        };

        fetchChatHistory();
    }, [userId]);

    const handleSendMessage = async () => {
        if (inputValue.trim() === '') return;

        const newMessage = { text: inputValue.trim(), isUser: true };
        setMessages([...messages, newMessage]);

        setInputValue('');
        setLoading(true);

        try {
            const response = await axios.post('/api/send-message', {
                message: inputValue.trim(),
                userId,
            });

            const botResponse = { text: response.data.botMessage, isUser: false };
            setMessages((prev) => [...prev, botResponse]);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-b from-purple-900 to-black text-white">
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
                        <div className={`p-2 rounded-lg max-w-md ${msg.isUser ? 'bg-blue-500' : 'bg-gray-800'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>
            {loading && <div>AI is typing...</div>}
            <div className="flex items-center p-4">
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-md border bg-gray-800 text-white resize-none"
                    placeholder="Type a message..."
                />
                <button className="bg-blue-500 text-white px-4 py-2 ml-2" onClick={handleSendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatScreen;
