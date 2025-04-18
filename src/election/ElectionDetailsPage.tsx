import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ELECTION_DETAILS } from '../api/queries';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomBarChart from '../components/CustomBarChart';

const ElectionDetailsPage = () => {
  const { electionId } = useParams();
  const { data, loading, error } = useQuery(GET_ELECTION_DETAILS, {
    variables: { electionId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const election = data.electionDetails;

  // Prepare data for the bar chart (votes per position)
  const voteDistributionData = election.positions.map((position) => ({
    positionName: position.name,
    totalVotes: position.candidates.reduce((sum, candidate) => sum + candidate.votes.length, 0),
  }));

  return (
    <div>
      <Navbar />
      <div className="bg-gray-900 text-white min-h-screen p-6">
        <h1 className="text-2xl font-bold text-[#FFE31A] mb-8">{election.name}</h1>

        {/* Election Details */}
        <div className="mb-8">
          <p className="text-gray-400 text-sm mb-2">Level: {election.level}</p>
          <p className="text-gray-400 text-sm mb-2">
            Date: {new Date(election.startDate).toLocaleDateString()} -{' '}
            {new Date(election.endDate).toLocaleDateString()}
          </p>
          <p className="text-gray-400 text-sm mb-2">{election.description}</p>
        </div>

        {/* Vote Distribution Chart */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Vote Distribution by Position</h2>
          <CustomBarChart
            data={voteDistributionData}
            xAxisKey="positionName"
            barKeys={['totalVotes']}
            colors={['#FFE31A']}
          />
        </div>

        {/* Positions and Candidates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {election.positions.map((position) => (
            <div key={position.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2 text-[#FFE31A]">{position.name}</h3>
              <ul>
                {position.candidates.map((candidate) => (
                  <li key={candidate.id} className="text-gray-400 text-sm mb-2">
                    {candidate.student.user.fullName} - {candidate.votes.length} votes
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ElectionDetailsPage;