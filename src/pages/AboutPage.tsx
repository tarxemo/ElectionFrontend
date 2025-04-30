// src/pages/AboutPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  

  const features = [
    {
      title: "Secure Voting",
      description: "Our system ensures each vote is securely cast and counted with blockchain-level integrity.",
      icon: "🔒"
    },
    {
      title: "Real-time Results",
      description: "View election results as they come in with our live updating dashboards.",
      icon: "📊"
    },
    {
      title: "Multi-level Elections",
      description: "Support for university, college, and hostel level elections in one unified system.",
      icon: "🏛️"
    },
    {
      title: "Comprehensive Analytics",
      description: "Detailed statistics and visualizations for understanding voter behavior and trends.",
      icon: "📈"
    }
  ];

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#FFE31A] mb-6">
              About Our Voting System
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A modern, secure, and transparent digital voting platform for the University of Dodoma community.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-bold text-[#FFE31A] mb-8">
              Our Mission
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-300 lg:mx-auto">
              To revolutionize student elections at the University of Dodoma by providing a secure, 
              accessible, and transparent digital voting platform that enhances democratic 
              participation across all levels of the university structure.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#FFE31A] text-center mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-4xl mb-4 text-[#FFE31A]">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section
      <div className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#FFE31A] text-center mb-12">
            Development Team
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-gray-900 p-6 rounded-lg shadow-lg text-center"
              >
                <div className="mx-auto h-32 w-32 rounded-full overflow-hidden mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#FFE31A]">{member.name}</h3>
                <p className="text-gray-400 mb-2">{member.role}</p>
                <p className="text-gray-300">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Technology Stack Section */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#FFE31A] text-center mb-12">
            Technology Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-4xl mb-4">⚛️</div>
              <h3 className="text-lg font-semibold text-white">React</h3>
              <p className="text-gray-400">Frontend</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-4xl mb-4">🐍</div>
              <h3 className="text-lg font-semibold text-white">Django</h3>
              <p className="text-gray-400">Backend</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-white">GraphQL</h3>
              <p className="text-gray-400">API</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-4xl mb-4">💾</div>
              <h3 className="text-lg font-semibold text-white">PostgreSQL</h3>
              <p className="text-gray-400">Database</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#FFE31A] mb-6">
            Ready to experience modern elections?
          </h2>
          <button
            onClick={() => navigate('/')}
            className="bg-[#FFE31A] hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors duration-300"
          >
            Explore the System
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;