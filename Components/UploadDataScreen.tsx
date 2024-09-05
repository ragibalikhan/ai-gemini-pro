// UploadDataScreen.tsx
import React, { useState } from 'react';

interface UploadDataScreenProps {
    onNext: () => void;
    onSkip: () => void;
}

const UploadDataScreen: React.FC<UploadDataScreenProps> = ({ onNext, onSkip }) => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0];
        if (uploadedFile) {
            setFile(uploadedFile);
        }
    };

    const processUploadedData = () => {
        if (file) {
            // Read the file content and store it globally (e.g., in localStorage)
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    const data = reader.result.toString();
                    localStorage.setItem('uploadedData', data);
                    onNext(); // Proceed to the next screen
                }
            };
            reader.readAsText(file);
        } else {
            onNext(); // Proceed to the next screen without uploading data
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-4">Upload Your Data</h1>
            <p className="mb-4">Upload your data (PDF, TXT, JSON, CSV) to enhance the AI chat bot experience.</p>
            <input type="file" accept=".pdf,.txt,.json,.csv" onChange={handleFileUpload} className="mb-4" />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4" onClick={processUploadedData}>Upload Data</button>
            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md" onClick={onSkip}>Skip</button>
        </div>
    );
};

export default UploadDataScreen;
