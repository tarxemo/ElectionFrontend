// src/pages/CollegeDetailsPage.tsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import {
  GET_COLLEGE_DETAILS,
  GET_HOSTELS_FOR_COLLEGE,
  GET_VOTER_TURNOUT_BY_HOSTEL,
  GET_AVERAGE_RATINGS_COMPARISON,
  GET_VOTE_COMPARISON_BETWEEN_HOSTELS,
  GET_TOP_CANDIDATES_BY_VOTES,
  GET_RATINGS_COMPARISON_BETWEEN_HOSTEL_LEADERS,
  GET_PROMISE_IMPLEMENTATION_COMPARISON
} from '../api/queries';
import { DonutChart } from '../components/charts/DonutChart';
import { ComposedChartComponent } from '../components/charts/ComposedChart';
import { ComparativeBarChart } from '../components/charts/ComparativeBarChart';
import { RadialBarChartComponent } from '../components/charts/RadialBarChart';
import { StackedBarChart } from '../components/charts/StackedBarChart';
import { TimeSeriesLineChart } from '../components/charts/TimeSeriesLineChart';
import Navbar from '../components/Navbar';


const CollegeDetailsPage: React.FC = () => {
    const { collegeId } = useParams<{ collegeId: string }>();
    const recentElectionId = '1'; // Should be dynamic in production

  // College basic information
  const { data: collegeData, loading: collegeLoading, error: collegeError } = useQuery(GET_COLLEGE_DETAILS, {
    variables: { collegeId }
  });

  // Hostels in this college
  const { data: hostelsData, loading: hostelsLoading } = useQuery(GET_HOSTELS_FOR_COLLEGE, {
    variables: { collegeId }
  });

  // Voter turnout by hostel
  const { data: turnoutData, loading: turnoutLoading } = useQuery(GET_VOTER_TURNOUT_BY_HOSTEL, {
    variables: { electionId: recentElectionId }
  });

  // Average ratings of candidates from this college
  const { data: ratingsData, loading: ratingsLoading } = useQuery(GET_AVERAGE_RATINGS_COMPARISON, {
    variables: { collegeId }
  });

  // Vote comparison between hostels
  const { data: votesComparisonData, loading: votesComparisonLoading } = useQuery(GET_VOTE_COMPARISON_BETWEEN_HOSTELS, {
    variables: { electionId: recentElectionId }
  });

  // Top candidates from this college
  const { data: topCandidatesData, loading: topCandidatesLoading } = useQuery(GET_TOP_CANDIDATES_BY_VOTES, {
    variables: { electionId: recentElectionId }
  });

  // Ratings of hostel leaders
  const { data: leadersRatingsData, loading: leadersRatingsLoading } = useQuery(GET_RATINGS_COMPARISON_BETWEEN_HOSTEL_LEADERS, {
    variables: { hostelId: null } // Get all hostels in college
  });

  // Promise implementation status
  const { data: promisesData, loading: promisesLoading } = useQuery(GET_PROMISE_IMPLEMENTATION_COMPARISON, {
    variables: { electionId: recentElectionId }
  });

  if (collegeLoading) return <div>Loading college data...</div>;
  if (collegeError) return <div>Error loading college: {collegeError.message}</div>;

  // Process data for visualizations
  const college = collegeData?.collegeDetails;
  
  const hostelsChartData = hostelsData?.hostelsForCollege?.map((hostel: any) => ({
    name: hostel.name,
    value: 1 // For simple count visualization
  })) || [];

  const turnoutChartData = turnoutData?.voterTurnoutByHostel?.map((hostel: any) => ({
    name: hostel.name,
    voters: hostel.totalVoters,
    votes: hostel.totalVotes,
    turnoutRate: ((hostel.totalVotes / hostel.totalVoters) * 100).toFixed(1)
  })) || [];

  const ratingsChartData = ratingsData?.averageRatingsComparison?.map((rating: any) => ({
    name: rating.studentUsername,
    value: parseFloat(rating.averageRating || 0)
  })) || [];

  const votesComparisonChartData = votesComparisonData?.voteComparisonBetweenHostels?.map((hostel: any) => ({
    name: hostel.name,
    votes: hostel.totalVotes
  })) || [];

  const topCandidatesChartData = topCandidatesData?.topCandidatesByVotes?.map((candidate: any) => ({
    name: candidate.studentUsername,
    votes: candidate.totalVotes
  })) || [];

  const leadersRatingsChartData = leadersRatingsData?.ratingsComparisonBetweenHostelLeaders?.map((leader: any) => ({
    name: leader.studentUsername,
    rating: parseFloat(leader.averageRating || 0)
  })) || [];

  const promisesChartData = promisesData?.promiseImplementationComparison?.map((candidate: any) => ({
    name: candidate.studentUsername,
    completed: candidate.completedPromises,
    pending: candidate.pendingPromises
  })) || [];

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      {/* College Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#FFE31A]">{college.name}</h1>
        <p className="text-white mt-2">{college.description}</p>
        <div className="flex items-center mt-4">
          <span className="text-white mr-4">
            <span className="font-semibold text-[#FFE31A]">University:</span> {college.university.name}
          </span>
          <span className="text-white">
            <span className="font-semibold text-[#FFE31A]">Hostels:</span> {hostelsData?.hostelsForCollege?.length || 0}
          </span>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Hostels Count */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Hostels</h2>
          {hostelsLoading ? (
            <div className="text-white">Loading hostels data...</div>
          ) : (
            <DonutChart
              data={hostelsChartData}
              title="Hostels"
              innerRadius={70}
              outerRadius={90}
            />
          )}
        </div>

        {/* Voter Turnout by Hostel */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Voter Turnout by Hostel</h2>
          {turnoutLoading ? (
            <div className="text-white">Loading turnout data...</div>
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
              xAxisLabel="Hostel"
              yAxisLabel="Count"
            />
          )}
        </div>

        {/* Vote Comparison Between Hostels */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Votes by Hostel</h2>
          {votesComparisonLoading ? (
            <div className="text-white">Loading votes comparison...</div>
          ) : (
            <ComparativeBarChart
              data={votesComparisonChartData}
              title="Total Votes"
              xAxisLabel="Hostel"
              yAxisLabel="Votes"
            />
          )}
        </div>

        {/* Top Candidates */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Top Candidates</h2>
          {topCandidatesLoading ? (
            <div className="text-white">Loading top candidates...</div>
          ) : (
            <RadialBarChartComponent
              data={topCandidatesChartData.map((item: any) => ({
                name: item.name,
                value: item.votes
              }))}
              title="Votes Received"
              innerRadius={20}
              outerRadius={140}
            />
          )}
        </div>

        {/* Candidate Ratings */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Candidate Ratings</h2>
          {ratingsLoading ? (
            <div className="text-white">Loading ratings...</div>
          ) : (
            <StackedBarChart
              data={ratingsChartData}
              bars={[
                { dataKey: 'value', name: 'Average Rating', color: '#FFE31A' }
              ]}
              xAxisLabel="Candidate"
              yAxisLabel="Rating (1-5)"
            />
          )}
        </div>

        {/* Hostel Leaders Ratings */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Hostel Leaders Ratings</h2>
          {leadersRatingsLoading ? (
            <div className="text-white">Loading leaders ratings...</div>
          ) : (
            <ComparativeBarChart
              data={leadersRatingsChartData}
              title="Average Rating"
              xAxisLabel="Leader"
              yAxisLabel="Rating"
            />
          )}
        </div>

        {/* Promise Implementation */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Promise Implementation Status</h2>
          {promisesLoading ? (
            <div className="text-white">Loading promises data...</div>
          ) : (
            <ComposedChartComponent
              data={promisesChartData}
              bars={[
                { dataKey: 'completed', name: 'Completed', color: '#4CAF50' },
                { dataKey: 'pending', name: 'Pending', color: '#FFC107' }
              ]}
              xAxisLabel="Candidate"
              yAxisLabel="Promises"
            />
          )}
        </div>

        {/* Ratings Trend Over Time */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Ratings Trend Over Time</h2>
          {leadersRatingsLoading ? (
            <div className="text-white">Loading ratings trend...</div>
          ) : (
            <TimeSeriesLineChart
              data={[
                { date: '2023-01', value: 4.2 },
                { date: '2023-02', value: 4.0 },
                { date: '2023-03', value: 4.5 },
                { date: '2023-04', value: 4.3 },
                { date: '2023-05', value: 4.7 }
              ]}
              title="Average Rating"
              xAxisLabel="Month"
              yAxisLabel="Rating"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CollegeDetailsPage;