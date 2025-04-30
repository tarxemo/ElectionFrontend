import React from 'react';
import VoterTurnoutChart from '../components/chart/VoterTurnoutChart';
import VotingActivityChart from '../components/chart/VotingActivityChart';
import CandidateComparisonChart from '../components/chart/CandidateComparisonChart';

const FeaturesSection: React.FC = () => {
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

  const candidateData = [
    { name: 'John Doe', votes: 1245 },
    { name: 'Jane Smith', votes: 982 },
    { name: 'Alex Johnson', votes: 756 },
    { name: 'Sarah Williams', votes: 1103 }
  ];

  const features = [
    {
      name: 'Real-time Analytics',
      description: 'Track election progress with live updates and interactive dashboards.',
      visualization: <VotingActivityChart data={trendData} />
    },
    {
      name: 'Transparent Results',
      description: 'Instant results with verifiable data visualizations for complete transparency.',
      visualization: <VoterTurnoutChart data={turnoutData} />
    },
    {
      name: 'Candidate Comparison',
      description: 'Compare candidate performance with detailed breakdowns and statistics.',
      visualization: <CandidateComparisonChart data={candidateData} />
    }
  ];

  return (
    <div className="relative bg-gray-800 py-16 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTggMGM0LjQxOCAwIDggMy41ODIgOCA4cy0zLjU4MiA4LTggOC04LTMuNTgyLTgtOCAzLjU4Mi04IDgtOHoiIGZpbGw9IiNGRkUzMUEiIGZpbGwtb3BhY2l0eT0iLjEiLz48L3N2Zz4=')]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="lg:text-center">
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gray-900 text-[#FFE31A] mb-4">
            POWERFUL FEATURES
          </span>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            <span className="block">Data-Driven</span>
            <span className="block text-[#FFE31A]">Election Insights</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
            Our platform transforms raw data into meaningful visualizations that tell the story of your election.
          </p>
        </div>

        <div className="mt-16">
          <div className="space-y-16">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}
              >
                <div className="lg:w-1/2">
                  <div className="bg-gray-900 rounded-xl p-4 shadow-2xl border border-gray-700">
                    {feature.visualization}
                  </div>
                </div>
                <div className="lg:w-1/2 lg:py-8">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFE31A]/10 text-[#FFE31A] font-bold mr-4">
                      {index + 1}
                    </div>
                    <h3 className="text-2xl font-bold text-white">{feature.name}</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {[
                      'Interactive data exploration',
                      'Real-time updates',
                      'Exportable reports',
                      'Mobile-responsive'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center">
                        <svg className="w-5 h-5 text-[#FFE31A] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
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