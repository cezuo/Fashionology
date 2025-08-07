import React from 'react';
import useChatGPTQuestions from '../hooks/useChatGPTQuestions';

const OnboardingPage = () => {
  const { question } = useChatGPTQuestions(); // Proper destructuring

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold mb-6">Onboarding</h1>
      
      {question ? (
        <div className="bg-gray-100 p-6 rounded-lg shadow w-full max-w-md text-center">
          <p className="text-xl mb-4">{question}</p>
          <input
            type="text"
            placeholder="Your answer..."
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            className="mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
          >
            Submit
          </button>
        </div>
      ) : (
        <p>Loading question...</p>
      )}
    </div>
  );
};

export default OnboardingPage;
