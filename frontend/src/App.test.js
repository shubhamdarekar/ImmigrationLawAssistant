import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoadingPage from './components/LoadingPage';
import MainLayout from './components/MainLayout';
import HomePage from './HomePage';
import NavigatorPage from './NavigatorPage';
import './App.css';

// Placeholder components for other tabs
const ChatbotPage = () => (
  <div className="flex flex-col items-center pt-12 px-4">
    <div className="rounded-full bg-blue-500 p-6 mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
    </div>
    <h2 className="text-3xl font-bold mb-4">Immigration Chatbot</h2>
    <p className="text-lg text-gray-600 text-center max-w-lg">
      Get answers to your immigration questions from our AI assistant.
    </p>
  </div>
);

const FormAssistantPage = () => (
  <div className="flex flex-col items-center pt-12 px-4">
    <div className="rounded-full bg-blue-500 p-6 mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
    </div>
    <h2 className="text-3xl font-bold mb-4">Form Assistant</h2>
    <p className="text-lg text-gray-600 text-center max-w-lg">
      Get help with completing immigration forms accurately and efficiently.
    </p>
  </div>
);

const LawyerConnectionPage = () => (
  <div className="flex flex-col items-center pt-12 px-4">
    <div className="rounded-full bg-blue-500 p-6 mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
    </div>
    <h2 className="text-3xl font-bold mb-4">Lawyer Connection</h2>
    <p className="text-lg text-gray-600 text-center max-w-lg">
      Connect with immigration lawyers for professional legal advice.
    </p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Initial route is the loading page */}
        <Route path="/" element={<LoadingPage />} />
        
        {/* Main layout with tabs */}
        <Route path="/app" element={<MainLayout />}>
          {/* Home page */}
          <Route index element={<HomePage />} />
          
          {/* Tab routes */}
          <Route path="navigator" element={<NavigatorPage />} />
          <Route path="chatbot" element={<ChatbotPage />} />
          <Route path="form-assistant" element={<FormAssistantPage />} />
          <Route path="lawyer-connection" element={<LawyerConnectionPage />} />
        </Route>
        
        {/* Redirect all other routes to the loading page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;