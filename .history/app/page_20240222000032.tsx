// pages/page.tsx
'use client'
import   {useState}  from 'react';
import StartScreen from '@/Components/GetStarted'
import UploadDataScreen from '@/Components/UploadDataScreen'
import ChatScreen from '@/Components/AiChat'

enum Screen {
    START,
    UPLOAD_DATA,
    CHAT,
}

const Page: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState(Screen.START);

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

    return (
        <div>
            {currentScreen === Screen.START && <StartScreen onNext={handleNext} />}
            {currentScreen === Screen.UPLOAD_DATA && <UploadDataScreen onNext={handleNext} onSkip={handleSkip} />}
            {currentScreen === Screen.CHAT && <ChatScreen />}
        </div>
    );
};

export default Page;
