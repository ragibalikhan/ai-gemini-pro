import React, { useState } from 'react';
import axios from 'axios';

interface StartScreenProps {
    onVerificationSuccess: (userId: string) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onVerificationSuccess }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [verificationSent, setVerificationSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Call backend API to send verification email
            const response = await axios.post('/api/send-verification', {
                email,
                name,
                phone,
            });

            setVerificationSent(true);
        } catch (error) {
            console.error('Error sending verification email:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerification = async (verificationCode: string) => {
        setLoading(true);
        try {
            // Verify the user with the code they received via email
            const response = await axios.post('/api/verify-user', {
                email,
                verificationCode,
            });

            if (response.data.success) {
                onVerificationSuccess(response.data.userId); // Return the user ID for login
            } else {
                console.error('Verification failed');
            }
        } catch (error) {
            console.error('Error verifying user:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-purple-900 to-black text-white">
            {!verificationSent ? (
                <div>
                    <h1 className="text-3xl font-bold mb-4">Register</h1>
                    <input
                        type="text"
                        placeholder="Name"
                        className="mb-2 p-2 rounded-md"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="mb-2 p-2 rounded-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Phone"
                        className="mb-2 p-2 rounded-md"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Submit'}
                    </button>
                </div>
            ) : (
                <div>
                    <h2>Enter Verification Code</h2>
                    <input
                        type="text"
                        placeholder="Verification Code"
                        className="mb-2 p-2 rounded-md"
                        onChange={(e) => handleVerification(e.target.value)}
                    />
                </div>
            )}
        </div>
    );
};

export default StartScreen;
