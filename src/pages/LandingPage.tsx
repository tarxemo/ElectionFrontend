import React from 'react';
import DemoSection from '../component/DemoSection';
import FeaturesSection from '../component/FeaturesSection';
import Footer from '../component/Footer';
import HeroSection from '../component/HeroSection';
import Navbar from '../components/Navbar';
import StatsSection from '../component/StatsSection';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen scroll-smooth">
      <Navbar />
      <main className="overflow-hidden">
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