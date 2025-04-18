import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_CANDIDATE_DETAILS } from '../api/queries';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomLineChart from '../components/CustomLineChart';

const CandidateProfilePage = () => {
  const { candidateId } = useParams();
  const { data, loading, error } = useQuery(GET_CANDIDATE_DETAILS, {
    variables: { candidateId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const candidate = data.candidateDetails;

  // Prepare data for the line chart (ratings over time)
  const ratingsData = candidate.ratings.map((rating) => ({
    timestamp: new Date(rating.timestamp).toLocaleDateString(),
    averageRating: rating.rating,
  }));

  return (
    <div>
      <Navbar />
      <div className="bg-gray-900 text-white min-h-screen p-6">
        <h1 className="text-2xl font-bold text-[#FFE31A] mb-8">{candidate.student.user.fullName}</h1>

        {/* Candidate Details */}
        <div className="mb-8">
          <p className="text-gray-400 text-sm mb-2">Position: {candidate.position.name}</p>
          <p className="text-gray-400 text-sm mb-2">College: {candidate.student.college.name}</p>
          <p className="text-gray-400 text-sm mb-2">Hostel: {candidate.student.hostel.name}</p>
          <p className="text-gray-400 text-sm mb-2">{candidate.manifesto}</p>
        </div>

        {/* Ratings Over Time Chart */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Ratings Over Time</h2>
          <CustomLineChart
            data={ratingsData}
            xAxisKey="timestamp"
            lineKeys={['averageRating']}
            colors={['#FFE31A']}
          />
        </div>

        {/* Promises */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#FFE31A]">Promises</h2>
          <ul>
            {candidate.promises.map((promise) => (
              <li key={promise.id} className="text-gray-400 text-sm mb-2">
                {promise.promise} - {promise.implementations[0]?.status || 'Pending'}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CandidateProfilePage;