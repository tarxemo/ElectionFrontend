// src/pages/WonLeadersPage.tsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_WON_LEADERS, GET_ELECTION_DETAILS } from '../api/queries';
import { ComparativeBarChart } from '../components/charts/ComparativeBarChart';
import { DonutChart } from '../components/charts/DonutChart';
import { RadialBarChartComponent } from '../components/charts/RadialBarChart';

const WonLeadersPage: React.FC = () => {
  const { electionId } = useParams<{ electionId: string }>();
  
  const { data: leadersData, loading: leadersLoading, error: leadersError } = useQuery(GET_WON_LEADERS, {
    variables: { electionId }
  });

  const { data: electionData } = useQuery(GET_ELECTION_DETAILS, {
    variables: { electionId }
  });

  if (leadersLoading) return <div className="text-white">Loading leaders...</div>;
  if (leadersError) return <div className="text-red-500">Error: {leadersError.message}</div>;

  const election = electionData?.electionDetails;
  const leaders = leadersData?.wonLeaders || [];

  // Prepare chart data
  const leadersChartData = leaders.map((leader: any) => ({
    name: leader.student.user.username,
    votes: leader.voteCount,
    position: leader.position.name
  }));

  const positionsDistribution = leaders.reduce((acc: any, leader: any) => {
    acc[leader.position.name] = (acc[leader.position.name] || 0) + 1;
    return acc;
  }, {});

  const positionsChartData = Object.entries(positionsDistribution).map((hostel:any) => ({
    name:hostel.name,
    value:hostel.value
  }));

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#FFE31A]">Election Winners</h1>
        <p className="text-white mt-2">
          {election?.name} - {election?.level} Election
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaders List */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Winning Leaders</h2>
          <ul className="space-y-3">
            {leaders.map((leader: any) => (
              <li key={leader.id} className="border-b border-gray-700 pb-3">
                <div className="font-bold text-[#FFE31A]">{leader.student.user.username}</div>
                <div className="text-white">Position: {leader.position.name}</div>
                <div className="text-white">Votes: {leader.voteCount}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Votes Comparison */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Votes Comparison</h2>
          <ComparativeBarChart
            data={leadersChartData}
            title="Votes Received"
            xAxisLabel="Leader"
            yAxisLabel="Votes"
          />
        </div>

        {/* Positions Distribution */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Positions Distribution</h2>
          <DonutChart
            data={positionsChartData}
            title="Positions"
          />
        </div>

        {/* Leaders Performance */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Leaders Performance</h2>
          <RadialBarChartComponent
            data={leadersChartData.map((leader: any) => ({
              name: leader.name,
              value: leader.votes
            }))}
            title="Votes"
            innerRadius={30}
            outerRadius={120}
          />
        </div>
      </div>
    </div>
  );
};

export default WonLeadersPage;