import React from 'react';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from './authConfig';
import LandingPage from './components/LandingPage';
import EmailProcessor from './components/EmailProcessor';
import { Inbox } from 'lucide-react';

function App() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch(e => {
      console.error(e);
    });
  };

  const handleLogout = () => {
    instance.logoutPopup().catch(e => {
      console.error(e);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <Inbox className="mr-2" />
            Outlook Email Processor
          </h1>
          {isAuthenticated && (
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
              Logout
            </button>
          )}
        </div>
      </header>
      <main className="container mx-auto mt-8 p-4 flex-grow">
        {isAuthenticated ? (
          <EmailProcessor />
        ) : (
          <LandingPage onLogin={handleLogin} />
        )}
      </main>
      <footer className="bg-gray-200 text-center p-4">
        <p>&copy; 2023 Outlook Email Processor. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;