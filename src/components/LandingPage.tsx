import React from 'react';
import { Mail } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-3xl font-bold mb-6">Welcome to Outlook Email Processor</h2>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Achieve inbox zero effortlessly! Our AI-powered tool automatically processes and archives your less important emails.
      </p>
      <button
        onClick={onLogin}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg flex items-center"
      >
        <Mail className="mr-2" />
        Login with Microsoft
      </button>
    </div>
  );
};

export default LandingPage;