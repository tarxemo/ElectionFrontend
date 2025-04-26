// src/components/sections/FeaturesSection.tsx
import React from 'react';
import { DonutChart } from './charts/DonutChart';
import { TimeSeriesLineChart } from './charts/TimeSeriesLineChart';

const FeaturesSection: React.FC = () => {
  // Sample data for demo visualizations
  const turnoutData = [
    { name: 'Voted', value: 75 },
    { name: 'Not Voted', value: 25 }
  ];

  const trendData = [
    { date: '9 AM', value: 10 },
    { date: '12 PM', value: 45 },
    { date: '3 PM', value: 30 },
    { date: '6 PM', value: 60 }
  ];

  const features = [
    {
      name: 'Real-time Analytics',
      description: 'Track election progress with live updates and interactive dashboards.',
      visualization: (
        <div className="h-60">
          <TimeSeriesLineChart
            data={trendData}
            title="Voting Activity"
            xAxisLabel="Time"
            yAxisLabel="Votes"
            color="#FFE31A"
            hideLegend
            compact
          />

        </div>
      )
    },
    {
      name: 'Transparent Results',
      description: 'Instant results with verifiable data visualizations for complete transparency.',
      visualization: (
        <div className="h-40">
          <DonutChart
            data={turnoutData}
            title="Voter Turnout"
            innerRadius={40}
            outerRadius={60}
          />
        </div>
      )
    },
    {
      name: 'Candidate Tracking',
      description: 'Monitor candidate promises and performance metrics throughout their term.',
      visualization: (
        <div className="h-40 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#FFE31A]">4.2</div>
            <div className="text-gray-400">Avg Rating</div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-4">
        <div className="lg:text-center">
          <h2 className="text-base text-[#FFE31A] font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            A better way to conduct campus elections
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  {feature.visualization}
                  <h3 className="mt-4 text-xl font-medium text-white">{feature.name}</h3>
                  <p className="mt-2 text-base text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;