// src/pages/ElectionsListPage.tsx
import React from 'react';
import { useQuery } from '@apollo/client';
import {
  GET_ELECTION_LIST,
  GET_VOTER_TURNOUT_BY_UNIVERSITY,
  GET_VOTES_TREND_FOR_POSITION,
  GET_PROMISE_IMPLEMENTATION_COMPARISON
} from '../api/queries';
import { ComparativeBarChart } from '../components/charts/ComparativeBarChart';
import { DonutChart } from '../components/charts/DonutChart';
import { StackedBarChart } from '../components/charts/StackedBarChart';
import { TimeSeriesLineChart } from '../components/charts/TimeSeriesLineChart';
import Navbar from '../components/Navbar';

interface Election {
  id: string;
  name: string;
  level: string;
  startDate: string;
  endDate: string;
  description?: string;
}

interface PromiseImplementationData {
  studentUsername: string;
  completedPromises: number;
  pendingPromises: number;
}

const ElectionsListPage: React.FC = () => {
  // Fetch all elections
  const { data: electionsData, loading: electionsLoading, error: electionsError } = useQuery(GET_ELECTION_LIST);

  // Fetch voter turnout data
  const { data: turnoutData, loading: turnoutLoading } = useQuery(GET_VOTER_TURNOUT_BY_UNIVERSITY);

  // Fetch votes trend for a sample position (could be made dynamic)
  const samplePositionId = '1'; // Should be dynamic in production
  const { data: votesTrendData, loading: votesTrendLoading } = useQuery(GET_VOTES_TREND_FOR_POSITION, {
    variables: { positionId: samplePositionId }
  });

  // Fetch promise implementation status
  const recentElectionId = '1'; // Should be dynamic in production
  const { data: promisesData, loading: promisesLoading } = useQuery(GET_PROMISE_IMPLEMENTATION_COMPARISON, {
    variables: { electionId: recentElectionId }
  });

  if (electionsLoading) return <div className="text-white">Loading elections...</div>;
  if (electionsError) return <div className="text-red-500">Error: {electionsError.message}</div>;

  const elections: Election[] = electionsData?.electionList || [];

  // Process data for visualizations
  const turnoutChartData = turnoutData?.voterTurnoutByUniversity?.map((uni: any) => ({
    name: uni.name,
    totalVoters: uni.totalVoters,
    totalVotes: uni.totalVotes,
    turnoutRate: ((uni.totalVotes / uni.totalVoters) * 100) || 0
  })) || [];

  const votesTrendChartData = votesTrendData?.votesTrendForPosition?.map((trend: any) => ({
    electionName: trend.electionName,
    totalVotes: trend.totalVotes
  })) || [];

  const promisesChartData: PromiseImplementationData[] = promisesData?.promiseImplementationComparison?.map((promise: any) => ({
    studentUsername: promise.studentUsername,
    completedPromises: promise.completedPromises || 0,
    pendingPromises: promise.pendingPromises || 0
  })) || [];

  // Group elections by level
  const electionsByLevel = elections.reduce((acc: Record<string, Election[]>, election) => {
    if (!acc[election.level]) {
      acc[election.level] = [];
    }
    acc[election.level].push(election);
    return acc;
  }, {});

  const levelDistributionData = Object.entries(electionsByLevel).map(([level, elections]) => ({
    name: level,
    value: elections.length
  }));

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#FFE31A]">Elections Overview</h1>
        <p className="text-white mt-2">Historical and current election data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Elections List */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">All Elections</h2>
          <div className="space-y-4">
            {Object.entries(electionsByLevel).map(([level, elections]) => (
              <div key={level}>
                <h3 className="font-bold text-[#FFE31A] mb-2">{level} Elections</h3>
                <ul className="space-y-2 pl-4">
                  {elections.map((election) => (
                    <li key={election.id} className="border-b border-gray-700 pb-2">
                      <div className="font-medium text-white">{election.name}</div>
                      <div className="text-sm text-gray-400">
                        {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Election Level Distribution */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Election Types</h2>
          <DonutChart
            data={levelDistributionData}
            title="Elections by Level"
          />
        </div>

        {/* Voter Turnout by University */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Voter Turnout by University</h2>
          {turnoutLoading ? (
            <div className="text-white">Loading turnout data...</div>
          ) : (
            <ComparativeBarChart
              data={turnoutChartData}
              title="Turnout Rate (%)"
              xAxisLabel="University"
              yAxisLabel="Percentage"
            />
          )}
        </div>

        {/* Votes Trend */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Voting Trend Over Elections</h2>
          {votesTrendLoading ? (
            <div className="text-white">Loading trend data...</div>
          ) : (
            <TimeSeriesLineChart
              data={votesTrendChartData}
              title="Total Votes"
              xAxisLabel="Election"
              yAxisLabel="Votes"
            />
          )}
        </div>

        {/* Promise Implementation */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Promise Completion</h2>
          {promisesLoading ? (
            <div className="text-white">Loading promise data...</div>
          ) : (
            <StackedBarChart
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
      </div>
    </div>
  );
};

export default ElectionsListPage;