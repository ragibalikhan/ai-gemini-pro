import React, { useState } from 'react';

interface StartScreenProps {
    onVerificationSuccess: (userId: string) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onVerificationSuccess }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [verificationSent, setVerificationSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        setLoading(true);

        const generatedCode = Math.floor(1000 + Math.random() * 9000).toString(); // Simulate verification code
        const user = {
            name,
            email,
            phone,
            verificationCode: generatedCode,
            verified: false,
            id: '',
        };

        // Save user temporarily to localStorage
        localStorage.setItem(email, JSON.stringify(user));

        alert(`Verification code sent: ${generatedCode}`); // Simulate email by showing the code
        setVerificationSent(true);
        setLoading(false);
    };

    const handleVerification = () => {
        setLoading(true);
        const storedUser = JSON.parse(localStorage.getItem(email) || '{}');

        if (storedUser.verificationCode === verificationCode) {
            // Generate a unique ID and mark as verified
            storedUser.verified = true;
            storedUser.id = Math.random().toString(36).substring(2, 10);

            localStorage.setItem(email, JSON.stringify(storedUser));
            onVerificationSuccess(storedUser.id);
        } else {
            alert('Invalid verification code');
        }
        setLoading(false);
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
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        onClick={handleVerification}
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default StartScreen;
