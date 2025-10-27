import React from 'react';
import logo from './logo.svg';
import './App.css';
import ProtectedRoute from './components/authentication/ProtectedRoute';

function App() {
  return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 underline decoration-red-500">
        Tailwind v3 is working 🎉
      </h1>
    </div>
  );
}

export default App;
