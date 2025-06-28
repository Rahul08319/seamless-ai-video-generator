
import React, { useState, useCallback } from 'react';
import { InputType, GenerationResult } from './types';
import { generateVideoConcept } from './services/geminiService';
import InputTabs from './components/InputTabs';
import FileInput from './components/FileInput';
import OutputDisplay from './components/OutputDisplay';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InputType>(InputType.TEXT);
  const [textInput, setTextInput] = useState<string>('');
  const [scriptInput, setScriptInput] = useState<string>('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);

  const isGenerateDisabled = () => {
    if (isLoading) return true;
    switch (activeTab) {
      case InputType.TEXT:
        return !textInput.trim();
      case InputType.SCRIPT:
        return !scriptInput.trim();
      case InputType.IMAGE:
      case InputType.AUDIO:
      case InputType.MODEL:
        return !fileInput;
      default:
        return true;
    }
  };

  const handleTabChange = (tab: InputType) => {
    setActiveTab(tab);
    // Reset inputs when changing tabs
    setTextInput('');
    setScriptInput('');
    setFileInput(null);
    setError(null);
  };

  const handleGenerate = useCallback(async () => {
    if (isGenerateDisabled()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    const textData = activeTab === InputType.SCRIPT ? scriptInput : textInput;
    
    try {
      const generatedResult = await generateVideoConcept(activeTab, textData, fileInput);
      setResult(generatedResult);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, textInput, scriptInput, fileInput]);


  const renderInput = () => {
    switch (activeTab) {
      case InputType.TEXT:
        return (
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="e.g., A robot exploring a lush, alien jungle at sunrise."
            className="w-full h-48 p-3 bg-gray-800/50 border-2 border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-200 placeholder-gray-500"
          />
        );
      case InputType.SCRIPT:
        return (
          <textarea
            value={scriptInput}
            onChange={(e) => setScriptInput(e.target.value)}
            placeholder="Paste your script here. The AI will visualize it scene by scene."
            className="w-full h-48 p-3 bg-gray-800/50 border-2 border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-200 placeholder-gray-500 font-mono"
          />
        );
      case InputType.IMAGE:
        return <FileInput id="image-upload" accept="image/*" onFileChange={setFileInput} file={fileInput} prompt="Upload or drop an image" />;
      case InputType.AUDIO:
        return <FileInput id="audio-upload" accept="audio/*" onFileChange={setFileInput} file={fileInput} prompt="Upload or drop an audio file" />;
      case InputType.MODEL:
        return <FileInput id="model-upload" accept="image/*" onFileChange={setFileInput} file={fileInput} prompt="Upload or drop a 3D model render" />; // Simulating with image upload
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Seamless AI Video Generator
          </h1>
          <p className="mt-2 text-lg text-gray-400 max-w-2xl mx-auto">
            Transform any concept into a cinematic video description with an AI-generated keyframe.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-gray-200">1. Provide Your Input</h2>
              <InputTabs activeTab={activeTab} onTabChange={handleTabChange} />
              <div className="mt-4">
                {renderInput()}
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerateDisabled()}
              className="w-full flex items-center justify-center py-4 px-6 text-lg font-bold rounded-lg transition-all duration-300 ease-in-out text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            >
               {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Video Concept'
              )}
            </button>
          </div>

          <div className="space-y-6">
             <h2 className="text-2xl font-bold text-gray-200 text-center lg:text-left">2. View Your Concept</h2>
            <OutputDisplay isLoading={isLoading} result={result} error={error} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
