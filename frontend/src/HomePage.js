import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, MessageSquare, FileText, Users } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  
  // Navigate to specific tabs when cards are clicked
  const handleCardClick = (path) => {
    navigate(`/${path}`);
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <img 
        src="/api/placeholder/800/400" 
        alt="Immigration assistance illustration" 
        className="rounded-lg shadow-lg mb-8 max-w-full"
      />
      <h1 className="text-3xl font-bold mb-4 text-center">Welcome to Immigration Law Assistant</h1>
      <p className="text-lg text-gray-600 text-center max-w-2xl mb-8">
        Your comprehensive guide to navigating the complex world of immigration law. 
        Choose from our suite of tools designed to make your immigration journey smoother.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <div 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleCardClick('navigator')}
        >
          <Compass size={32} className="text-blue-500 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Navigator</h3>
          <p className="text-gray-600">Find your path with step-by-step guidance</p>
        </div>
        <div 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleCardClick('chatbot')}
        >
          <MessageSquare size={32} className="text-blue-500 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Chatbot</h3>
          <p className="text-gray-600">Get answers to your immigration questions</p>
        </div>
        <div 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleCardClick('form-assistant')}
        >
          <FileText size={32} className="text-blue-500 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Form Assistant</h3>
          <p className="text-gray-600">Complete immigration forms with confidence</p>
        </div>
        <div 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleCardClick('lawyer-connection')}
        >
          <Users size={32} className="text-blue-500 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Lawyer Connection</h3>
          <p className="text-gray-600">Connect with professional immigration lawyers</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;