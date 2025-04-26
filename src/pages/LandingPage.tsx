// src/pages/LandingPage.tsx
import React from 'react';
import DemoSection from '../components/DemoSection';
import FeaturesSection from '../components/FeaturesSection';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import Navbar from '../components/Navbar';
import StatsSection from '../components/StatsSection';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <DemoSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;