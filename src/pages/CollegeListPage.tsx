// src/pages/CollegeListPage.tsx
import React from 'react';
import { useQuery } from '@apollo/client';
import {
  GET_COLLEGE_LIST,
  GET_VOTER_TURNOUT_BY_COLLEGE,
  GET_AVERAGE_RATINGS_COMPARISON,
  GET_VOTE_DISTRIBUTION_ACROSS_COLLEGES,
  GET_VOTES_COMPARISON_BETWEEN_COLLEGES
} from '../api/queries';
import { ComposedChartComponent } from '../components/charts/ComposedChart';
import { DonutChart } from '../components/charts/DonutChart';
import { ComparativeBarChart } from '../components/charts/ComparativeBarChart';
import { StackedBarChart } from '../components/charts/StackedBarChart';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CollegeListPage: React.FC = () => {
  const { data: collegesData, loading: collegesLoading, error: collegesError } = useQuery(GET_COLLEGE_LIST);

  const recentElectionId = '1';

  const { data: turnoutData, loading: turnoutLoading } = useQuery(GET_VOTER_TURNOUT_BY_COLLEGE, {
    variables: { electionId: recentElectionId }
  });

  const { data: ratingsData, loading: ratingsLoading } = useQuery(GET_AVERAGE_RATINGS_COMPARISON, {
    variables: { collegeId: 1 }
  });

  const { data: distributionData, loading: distributionLoading } = useQuery(GET_VOTE_DISTRIBUTION_ACROSS_COLLEGES, {
    variables: { electionId: recentElectionId }
  });

  const { data: votesComparisonData, loading: votesComparisonLoading } = useQuery(GET_VOTES_COMPARISON_BETWEEN_COLLEGES, {
    variables: { electionId: recentElectionId }
  });

  if (collegesLoading) return <div>Loading colleges...</div>;
  if (collegesError) return <div>Error loading colleges: {collegesError.message}</div>;

  const turnoutChartData = turnoutData?.voterTurnoutByCollege?.map((college: any) => ({
    name: college.name,
    voters: college.totalVoters,
    votes: college.totalVotes,
    turnoutRate: ((college.totalVotes / college.totalVoters) * 100).toFixed(1)
  })) || [];

  const ratingsChartData = ratingsData?.averageRatingsComparison?.map((rating: any) => ({
    name: rating.studentUsername,
    value: parseFloat(rating.averageRating || 0)
  })) || [];

  const distributionChartData = distributionData?.voteDistributionAcrossColleges?.map((college: any) => ({
    name: college.name,
    value: college.totalVotes
  })) || [];

  const votesComparisonChartData = votesComparisonData?.votesComparisonBetweenColleges?.map((college: any) => ({
    name: college.name,
    votes: college.totalVotes
  })) || [];

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <h1 className="text-[#FFE31A] text-3xl">Colleges Overview</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        {/* College List */}
        <div className="bg-gray-800 rounded shadow p-4 col-span-1">
        <h2 className="text-lg font-semibold mb-4 text-[#FFE31A]">Colleges</h2>
        <ul>
            {collegesData?.collegeList?.map((college: any) => (
            <li key={college.id} className="mb-2 border-b pb-2">
                <Link
                to={`/college/${college.id}`}
                className="font-medium text-[#FFE31A] hover:underline hover:text-yellow-300 block"
                >
                {college.name}
                </Link>
                <div className="text-sm text-white">University: {college.university.name}</div>
            </li>
            ))}
        </ul>
        </div>


        {/* Voter Turnout by College */}
        <div className="bg-gray-800 rounded shadow p-4 col-span-3">
          <h2 className="text-lg font-semibold mb-4 text-[#FFE31A]">Voter Turnout by College</h2>
          {turnoutLoading ? (
            <div>Loading voter turnout data...</div>
          ) : (
            <ComposedChartComponent
              data={turnoutChartData}
              bars={[
                { dataKey: 'voters', name: 'Total Voters', color: '#8884d8' },
                { dataKey: 'votes', name: 'Total Votes', color: '#82ca9d' }
              ]}
              lines={[
                { dataKey: 'turnoutRate', name: 'Turnout Rate (%)', color: '#ff7300', strokeWidth: 2 }
              ]}
              xAxisLabel="College"
              yAxisLabel="Count"
            />
          )}
        </div>

        {/* Vote Distribution Across Colleges */}
        <div className="bg-gray-800 rounded shadow p-4 col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-[#FFE31A]">Vote Distribution Across Colleges</h2>
          {distributionLoading ? (
            <div>Loading distribution data...</div>
          ) : (
            <DonutChart
              data={distributionChartData}
              title="Votes by College"
            />
          )}
        </div>

        {/* Average Ratings Comparison */}
        <div className="bg-gray-800 rounded shadow p-4 col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-[#FFE31A]">Average Candidate Ratings by College</h2>
          {ratingsLoading ? (
            <div>Loading ratings data...</div>
          ) : (
            <ComparativeBarChart
              data={ratingsChartData}
              title="Average Rating"
              xAxisLabel="Candidate"
              yAxisLabel="Rating (1-5)"
            />
          )}
        </div>

        {/* Votes Comparison Between Colleges */}
        <div className="bg-gray-800 rounded shadow p-4 col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-[#FFE31A]">Votes Comparison Between Colleges</h2>
          {votesComparisonLoading ? (
            <div>Loading votes comparison data...</div>
          ) : (
            <StackedBarChart
              data={votesComparisonChartData}
              bars={[
                { dataKey: 'votes', name: 'Total Votes', color: '#FFE31A' }
              ]}
              xAxisLabel="College"
              yAxisLabel="Votes"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CollegeListPage;
