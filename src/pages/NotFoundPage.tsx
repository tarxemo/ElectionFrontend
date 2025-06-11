import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 px-6 text-center">
      <AlertTriangle className="text-[#FFE31A] w-20 h-20 mb-6 animate-pulse" />
      <h1 className="text-5xl font-bold mb-4">Page Not Found</h1>
      <p className="text-lg mb-6 max-w-xl">
        The page you are looking for doesn't exist or has been moved. Please check the URL or go back to the homepage.
      </p>
      <Link
        to="/"
        className="bg-[#FFE31A] text-gray-900 px-6 py-3 rounded-md font-semibold text-sm hover:bg-yellow-400 transition duration-300"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
