// src/pages/CollegeHostelsPage.tsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import {
  GET_COLLEGE_DETAILS,
  GET_HOSTELS_FOR_COLLEGE,
  GET_HOSTEL_LEADER_STATS,
  GET_VOTER_TURNOUT_BY_HOSTEL
} from '../api/queries';
import { ComparativeBarChart } from '../components/charts/ComparativeBarChart';
import { DonutChart } from '../components/charts/DonutChart';
import { StackedBarChart } from '../components/charts/StackedBarChart';
import { TimeSeriesLineChart } from '../components/charts/TimeSeriesLineChart';
import Navbar from '../components/Navbar';

const CollegeHostelsPage: React.FC = () => {
  const { collegeId } = useParams<{ collegeId: string }>();
  const recentElectionId = '1'; // Should be dynamic in production

  // College data
  const { data: collegeData } = useQuery(GET_COLLEGE_DETAILS, {
    variables: { collegeId }
  });

  // Hostels data
  const { data: hostelsData, loading: hostelsLoading } = useQuery(GET_HOSTELS_FOR_COLLEGE, {
    variables: { collegeId }
  });

  // Voter turnout by hostel
  const { data: turnoutData, loading: turnoutLoading } = useQuery(GET_VOTER_TURNOUT_BY_HOSTEL, {
    variables: { electionId: recentElectionId }
  });

  // Prepare leader stats for all hostels
  const hostelLeaderQueries = hostelsData?.hostelsForCollege?.map((hostel: any) => ({
    query: useQuery(GET_HOSTEL_LEADER_STATS, {
      variables: { hostelId: hostel.id },
      skip: !hostel.id
    }),
    hostelId: hostel.id
  })) || [];

  if (hostelsLoading) return <div className="text-white">Loading hostels data...</div>;

  const college = collegeData?.collegeDetails;
  const hostels = hostelsData?.hostelsForCollege || [];

  // Process data for visualizations
  const hostelsChartData = hostels.map((hostel: any) => ({
    name: hostel.name,
    value: 1 // For count visualization
  }));

  const turnoutChartData = turnoutData?.voterTurnoutByHostel?.map((hostel: any) => ({
    name: hostel.name,
    voters: hostel.totalVoters,
    votes: hostel.totalVotes,
    turnoutRate: ((hostel.totalVotes / hostel.totalVoters) * 100).toFixed(1)
  })) || [];

  // Combine leader stats
//   const leaderStatsData = hostelLeaderQueries.reduce((acc: any[], { query }) => {
//     if (query.data?.hostelLeaderStats) {
//       return [...acc, ...query.data.hostelLeaderStats];
//     }
//     return acc;
//   }, []);

  const leaderRatingsChartData = hostelLeaderQueries.map((leader: any) => ({
    name: leader.student__user__username,
    rating: parseFloat(leader.avg_rating || 0),
    position: leader.position__name
  }));

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#FFE31A]">{college?.name} Hostels</h1>
        <p className="text-white mt-2">Detailed statistics for all hostels in this college</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hostels List */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Hostels List</h2>
          <ul className="space-y-2">
            {hostels.map((hostel: any) => (
              <li key={hostel.id} className="border-b border-gray-700 pb-2">
                <div className="font-semibold text-[#FFE31A]">{hostel.name}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Hostels Count */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Hostels Distribution</h2>
          <DonutChart
            data={hostelsChartData}
            title="Hostels"
            innerRadius={50}
            outerRadius={70}
          />
        </div>

        {/* Voter Turnout */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Voter Turnout by Hostel</h2>
          {turnoutLoading ? (
            <div className="text-white">Loading turnout data...</div>
          ) : (
            <StackedBarChart
              data={turnoutChartData}
              bars={[
                { dataKey: 'voters', name: 'Total Voters', color: '#8884d8' },
                { dataKey: 'votes', name: 'Total Votes', color: '#82ca9d' }
              ]}
              xAxisLabel="Hostel"
              yAxisLabel="Count"
            />
          )}
        </div>

        {/* Leaders Ratings */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Hostel Leaders Ratings</h2>
          {hostelLeaderQueries[0]?.query.loading ? (
            <div className="text-white">Loading leaders data...</div>
          ) : (
            <ComparativeBarChart
              data={leaderRatingsChartData}
              title="Average Rating"
              xAxisLabel="Leader"
              yAxisLabel="Rating (1-5)"
            />
          )}
        </div>

        {/* Turnout Trend */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Turnout Trend</h2>
          <TimeSeriesLineChart
            data={[
              { date: 'Jan', value: 65 },
              { date: 'Feb', value: 72 },
              { date: 'Mar', value: 68 },
              { date: 'Apr', value: 75 },
              { date: 'May', value: 80 }
            ]}
            title="Turnout %"
            xAxisLabel="Month"
            yAxisLabel="Percentage"
          />
        </div>
      </div>
    </div>
  );
};

export default CollegeHostelsPage;