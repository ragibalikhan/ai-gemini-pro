'use client';

import { useState } from 'react';
import StartScreen from '@/Components/GetStarted';
import UploadDataScreen from '@/Components/UploadDataScreen';
import ChatScreen from '@/Components/AiChat';

enum Screen {
    START,
    UPLOAD_DATA,
    CHAT,
}

const Page: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState(Screen.START);
    const [userId, setUserId] = useState<string | null>(null); // Track the user's unique ID

    const handleNext = () => {
        switch (currentScreen) {
            case Screen.START:
                setCurrentScreen(Screen.UPLOAD_DATA);
                break;
            case Screen.UPLOAD_DATA:
                setCurrentScreen(Screen.CHAT);
                break;
            default:
                break;
        }
    };

    const handleSkip = () => {
        setCurrentScreen(Screen.CHAT);
    };

    const handleVerificationSuccess = (id: string) => {
        setUserId(id); // Store the verified user ID
        setCurrentScreen(Screen.UPLOAD_DATA); // Proceed to the next screen after verification
    };

    return (
        <div>
            {currentScreen === Screen.START && (
                <StartScreen onVerificationSuccess={handleVerificationSuccess} />
            )}
            {currentScreen === Screen.UPLOAD_DATA && (
                <UploadDataScreen onNext={handleNext} onSkip={handleSkip} />
            )}
            {currentScreen === Screen.CHAT && <ChatScreen userId={userId} />}
        </div>
    );
};

export default Page;
