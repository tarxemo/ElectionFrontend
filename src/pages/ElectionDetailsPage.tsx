// src/pages/ElectionDetailsPage.tsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import {
  GET_ELECTION_DETAILS,
  GET_TOTAL_VOTES_PER_CANDIDATE,
  GET_VOTE_DISTRIBUTION_BY_POSITION,
  GET_VOTE_TRENDS_OVER_TIME,
  GET_TOP_CANDIDATES_BY_VOTES,
  GET_PROMISE_IMPLEMENTATION_COMPARISON
} from '../api/queries';
import { ComparativeBarChart } from '../components/charts/ComparativeBarChart';
import { ComposedChartComponent } from '../components/charts/ComposedChart';
import { DonutChart } from '../components/charts/DonutChart';
import { RadialBarChartComponent } from '../components/charts/RadialBarChart';
import { TimeSeriesLineChart } from '../components/charts/TimeSeriesLineChart';
import Navbar from '../components/Navbar';

interface CandidateVotes {
  studentUsername: string;
  totalVotes: number;
  positionName: string;
}

interface PromiseStatus {
  studentUsername: string;
  completedPromises: number;
  pendingPromises: number;
}

const ElectionDetailsPage: React.FC = () => {
  const { electionId } = useParams<{ electionId: string }>();

  // Fetch election details
  const { data: electionData, loading: electionLoading, error: electionError } = useQuery(GET_ELECTION_DETAILS, {
    variables: { electionId }
  });

  // Fetch total votes per candidate
  const { data: votesPerCandidateData, loading: votesPerCandidateLoading } = useQuery(GET_TOTAL_VOTES_PER_CANDIDATE, {
    variables: { electionId }
  });

  // Fetch vote distribution by position
  const { data: voteDistributionData, loading: voteDistributionLoading } = useQuery(GET_VOTE_DISTRIBUTION_BY_POSITION, {
    variables: { electionId }
  });

  // Fetch vote trends over time
  const { data: voteTrendsData, loading: voteTrendsLoading } = useQuery(GET_VOTE_TRENDS_OVER_TIME, {
    variables: { electionId }
  });

  // Fetch top candidates
  const { data: topCandidatesData, loading: topCandidatesLoading } = useQuery(GET_TOP_CANDIDATES_BY_VOTES, {
    variables: { electionId }
  });

  // Fetch promise implementation
  const { data: promisesData, loading: promisesLoading } = useQuery(GET_PROMISE_IMPLEMENTATION_COMPARISON, {
    variables: { electionId }
  });

  if (electionLoading) return <div className="text-white">Loading election data...</div>;
  if (electionError) return <div className="text-red-500">Error: {electionError.message}</div>;

  const election = electionData?.electionDetails;
  
  // Process data for visualizations
  const candidatesVotesData: CandidateVotes[] = votesPerCandidateData?.totalVotesPerCandidate?.map((candidate: any) => ({
    studentUsername: candidate.studentUsername,
    totalVotes: candidate.totalVotes,
    positionName: candidate.positionName || 'Unknown'
  })) || [];

  const voteDistributionChartData = voteDistributionData?.voteDistributionByPosition?.map((position: any) => ({
    name: position.name,
    totalVotes: position.totalVotes
  })) || [];

  const voteTrendsChartData = voteTrendsData?.voteTrendsOverTime?.map((trend: any) => ({
    timestamp: trend.timestamp,
    totalVotes: trend.totalVotes
  })) || [];

  const topCandidatesChartData = topCandidatesData?.topCandidatesByVotes?.map((candidate: any) => ({
    name: candidate.studentUsername,
    votes: candidate.totalVotes
  })) || [];

  const promisesChartData: PromiseStatus[] = promisesData?.promiseImplementationComparison?.map((promise: any) => ({
    studentUsername: promise.studentUsername,
    completedPromises: promise.completedPromises || 0,
    pendingPromises: promise.pendingPromises || 0
  })) || [];

  // Group candidates by position for better visualization
  const candidatesByPosition = candidatesVotesData.reduce((acc: Record<string, CandidateVotes[]>, candidate) => {
    if (!acc[candidate.positionName]) {
      acc[candidate.positionName] = [];
    }
    acc[candidate.positionName].push(candidate);
    return acc;
  }, {});

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      {/* Election Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#FFE31A]">{election?.name}</h1>
        <div className="flex flex-wrap items-center mt-2 gap-4">
          <span className="text-white">
            <span className="font-semibold text-[#FFE31A]">Level:</span> {election?.level}
          </span>
          <span className="text-white">
            <span className="font-semibold text-[#FFE31A]">Period:</span> {new Date(election?.startDate).toLocaleDateString()} - {new Date(election?.endDate).toLocaleDateString()}
          </span>
          <span className="text-white">
            <span className="font-semibold text-[#FFE31A]">Positions:</span> {election?.positions?.length || 0}
          </span>
        </div>
        {election?.description && (
          <p className="text-white mt-4">{election.description}</p>
        )}
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Vote Distribution by Position */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Votes by Position</h2>
          {voteDistributionLoading ? (
            <div className="text-white">Loading vote distribution...</div>
          ) : (
            <DonutChart
              data={voteDistributionChartData}
              title="Vote Distribution"
              innerRadius={50}
              outerRadius={80}
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
              data={topCandidatesChartData}
              title="Votes Received"
              innerRadius={20}
              outerRadius={100}
            />
          )}
        </div>

        {/* Candidates by Position */}
        {Object.entries(candidatesByPosition).map(([position, candidates]) => (
          <div key={position} className="bg-gray-800 rounded-lg shadow-lg p-4 lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">{position} Candidates</h2>
            {votesPerCandidateLoading ? (
              <div className="text-white">Loading candidates data...</div>
            ) : (
              <ComparativeBarChart
                data={candidates.map(c => ({
                  name: c.studentUsername,
                  value: c.totalVotes
                }))}
                title="Votes Received"
                xAxisLabel="Candidate"
                yAxisLabel="Votes"
              />
            )}
          </div>
        ))}

        {/* Vote Trends Over Time */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Voting Activity Over Time</h2>
          {voteTrendsLoading ? (
            <div className="text-white">Loading vote trends...</div>
          ) : (
            <TimeSeriesLineChart
              data={voteTrendsChartData}
              title="Votes Cast"
              xAxisLabel="Date"
              yAxisLabel="Votes"
            />
          )}
        </div>

        {/* Promise Implementation */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Promise Implementation Status</h2>
          {promisesLoading ? (
            <div className="text-white">Loading promise data...</div>
          ) : (
            <ComposedChartComponent
              data={promisesChartData}
              bars={[
                { dataKey: 'completedPromises', name: 'Completed', color: '#4CAF50' },
                { dataKey: 'pendingPromises', name: 'Pending', color: '#FFC107' }
              ]}
              xAxisLabel="Candidate"
              yAxisLabel="Promises"
            />
          )}
        </div>

        {/* Election Positions */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Positions Contested</h2>
          <ul className="space-y-2">
            {election?.positions?.map((position: any) => (
              <li key={position.id} className="border-b border-gray-700 pb-2">
                <div className="font-medium text-white">{position.name}</div>
                <div className="text-sm text-gray-400">{position.level}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ElectionDetailsPage;