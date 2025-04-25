import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Compass, MessageSquare, FileText, Users } from 'lucide-react';

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-500 w-full text-white p-4">
        <h1 className="text-xl font-bold text-center">Immigration Law Assistant</h1>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b bg-white">
        <NavLink 
          to="/navigator" 
          className={({ isActive }) => 
            `flex-1 py-4 px-2 font-medium text-sm flex flex-col items-center justify-center ${
              isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`
          }
        >
          <Compass size={24} className="mb-1" />
          Navigator
        </NavLink>
        <NavLink 
          to="/chatbot" 
          className={({ isActive }) => 
            `flex-1 py-4 px-2 font-medium text-sm flex flex-col items-center justify-center ${
              isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`
          }
        >
          <MessageSquare size={24} className="mb-1" />
          Chatbot
        </NavLink>
        <NavLink 
          to="/form-assistant" 
          className={({ isActive }) => 
            `flex-1 py-4 px-2 font-medium text-sm flex flex-col items-center justify-center ${
              isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`
          }
        >
          <FileText size={24} className="mb-1" />
          Form Assistant
        </NavLink>
        <NavLink 
          to="/lawyer-connection" 
          className={({ isActive }) => 
            `flex-1 py-4 px-2 font-medium text-sm flex flex-col items-center justify-center ${
              isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`
          }
        >
          <Users size={24} className="mb-1" />
          Lawyer Connection
        </NavLink>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;