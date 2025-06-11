import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_ACTIVE_ELECTIONS,
  GET_ELECTION_POSITIONS,
  GET_POSITION_CANDIDATES,
  GET_ELIGIBLE_VOTERS,
  CAST_VOTES
} from '../api/queries';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const VotePage = () => {
  const [selectedElection, setSelectedElection] = useState(null);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [votes, setVotes] = useState({});
  const [voterSearch, setVoterSearch] = useState('');
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [showVoterSelect, setShowVoterSelect] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  
  // Fetch active elections
  const { data: electionsData, loading: electionsLoading, error: electionsError } = useQuery(GET_ACTIVE_ELECTIONS);
  
  // Fetch positions for selected election
  const { data: positionsData, loading: positionsLoading } = useQuery(GET_ELECTION_POSITIONS, {
    variables: { electionId: selectedElection?.id },
    skip: !selectedElection
  });
  
  // Query for eligible voters
  const { data: votersData, loading: votersLoading } = useQuery(GET_ELIGIBLE_VOTERS, {
    variables: { 
      electionId: selectedElection?.id,
      search: voterSearch 
    },
    skip: !selectedElection
  });
  
  // Mutation for casting votes
  const [castVotes, { data: voteResult, loading: votingLoading, error: votingError }] = useMutation(CAST_VOTES);

  // Handle election selection
  const handleElectionSelect = (election) => {
    setSelectedElection(election);
    setSelectedPositions([]);
    setVotes({});
    setSelectedVoter(null);
    setCurrentStep(2);
    setErrors({});
  };

  // Handle position selection
  const handlePositionSelect = (position) => {
    if (selectedPositions.some(p => p.id === position.id)) {
      setSelectedPositions(selectedPositions.filter(p => p.id !== position.id));
      const newVotes = {...votes};
      delete newVotes[position.id];
      setVotes(newVotes);
    } else {
      setSelectedPositions([...selectedPositions, position]);
      setCurrentStep(3);
    }
    setErrors({});
  };

  // Handle candidate selection for a position
  const handleCandidateSelect = (positionId, candidate) => {
    setVotes({
      ...votes,
      [positionId]: candidate
    });
    setErrors({});
  };

  // Validate before moving to voter selection
  const validateBeforeVoterSelect = () => {
    const allPositionsVoted = selectedPositions.every(position => votes[position.id]);
    if (!allPositionsVoted) {
      setErrors({ positions: 'Please select a candidate for each position' });
      return false;
    }
    setErrors({});
    return true;
  };

  // Submit votes
  const handleSubmitVotes = async () => {
    if (!selectedVoter) {
      setErrors({ voter: 'Please select a voter' });
      return;
    }
    
    try {
      const votesInput = selectedPositions.map(position => ({
        electionId: selectedElection.id,
        candidateId: votes[position.id].id,
        voterId: selectedVoter.id
      }));
      
      await castVotes({
        variables: {
          input: {
            votes: votesInput
          }
        }
      });
    } catch (error) {
      console.error("Error casting votes:", error);
    }
  };

  // Handle successful vote submission
  useEffect(() => {
    if (voteResult?.castVotes?.success) {
      navigate('/vote', { 
        state: { 
          electionName: selectedElection.name,
          votes: voteResult.castVotes.votes 
        } 
      });
    }
  }, [voteResult, navigate, selectedElection]);

  // Navigation between steps
  const nextStep = () => {
    if (currentStep === 3 && !validateBeforeVoterSelect()) return;
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  if (electionsLoading) return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
        <p className="mt-4">Loading elections...</p>
      </div>
    </div>
  );
  
  if (electionsError) return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 text-center text-red-400">
        Error loading elections: {electionsError.message}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">Voting Center</h1>
          <p className="text-xl text-gray-300">Cast your vote in active elections</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Progress Steps */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border-l-4 border-purple-500">
          <div className="flex justify-between items-center mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-400'
                } font-bold`}>
                  {step}
                </div>
                <span className={`mt-2 text-sm ${
                  currentStep >= step ? 'text-yellow-400' : 'text-gray-400'
                }`}>
                  {step === 1 && 'Election'}
                  {step === 2 && 'Positions'}
                  {step === 3 && 'Candidates'}
                  {step === 4 && 'Voter'}
                </span>
              </div>
            ))}
          </div>
          
          {/* Step 1: Select Election */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-purple-400 mb-4">1. Select Election</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {electionsData?.activeElections?.map(election => (
                  <div 
                    key={election.id}
                    onClick={() => handleElectionSelect(election)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedElection?.id === election.id 
                        ? 'bg-purple-600 border-2 border-purple-400' 
                        : 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
                    }`}
                  >
                    <h3 className="font-bold text-lg">{election.name}</h3>
                    <p className="text-sm text-gray-300">{election.level.level} - {election.institution?.name || 'General'}</p>
                    <p className="text-xs mt-2">
                      {new Date(election.startDatetime).toLocaleString()} to<br />
                      {new Date(election.endDatetime).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Step 2: Select Positions */}
          {currentStep === 2 && selectedElection && (
            <div>
              <h2 className="text-2xl font-bold text-green-400 mb-4">2. Select Positions to Vote On</h2>
              
              {positionsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-400 mx-auto"></div>
                  <p className="mt-2">Loading positions...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {positionsData?.electionPositions?.map(position => (
                    <div 
                      key={position.id}
                      onClick={() => handlePositionSelect(position)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedPositions.some(p => p.id === position.id)
                          ? 'bg-green-600 border-2 border-green-400' 
                          : 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
                      }`}
                    >
                      <h3 className="font-bold text-lg">{position.position.name}</h3>
                      <p className="text-sm text-gray-300">Select {position.maxCandidates} candidate(s)</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Step 3: Select Candidates */}
          {currentStep === 3 && selectedPositions.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">3. Select Your Candidates</h2>
              
              {selectedPositions.map(position => (
                <PositionCandidates 
                  key={position.id}
                  position={position}
                  selectedCandidate={votes[position.id]}
                  onSelectCandidate={(candidate) => handleCandidateSelect(position.id, candidate)}
                />
              ))}
              
              {errors.positions && (
                <div className="mt-4 text-red-400">
                  {errors.positions}
                </div>
              )}
            </div>
          )}
          
          {/* Step 4: Select Voter */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-blue-400 mb-4">4. Verify Voter Identity</h2>
              
              {!selectedVoter || showVoterSelect ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Search Voters</label>
                    <input
                      type="text"
                      value={voterSearch}
                      onChange={(e) => setVoterSearch(e.target.value)}
                      placeholder="Search by name or username"
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {votersLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400 mx-auto"></div>
                      <p className="mt-2">Loading eligible voters...</p>
                    </div>
                  ) : (
                    <div className="max-h-64 overflow-y-auto">
                      {votersData?.eligibleVoters?.length > 0 ? (
                        votersData.eligibleVoters.map(voter => (
                          <div 
                            key={voter.id}
                            onClick={() => {
                              setSelectedVoter(voter);
                              setShowVoterSelect(false);
                            }}
                            className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700"
                          >
                            <div className="flex justify-between">
                              <span className="font-medium">
                                {voter.user.firstName} {voter.user.lastName}
                              </span>
                              <span className="text-sm text-gray-400">{voter.user.username}</span>
                            </div>
                            <div className="text-sm text-gray-400">
                              {voter.institution.name} ({voter.institution.level.level})
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-400">
                          {voterSearch ? 'No matching voters found' : 'No eligible voters found'}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">
                        {selectedVoter.user.firstName} {selectedVoter.user.lastName}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {selectedVoter.institution.name} ({selectedVoter.institution.level.level})
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowVoterSelect(true)}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Change Voter
                    </button>
                  </div>
                </div>
              )}
              
              {errors.voter && (
                <div className="mt-4 text-red-400">
                  {errors.voter}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="px-6 py-2 rounded-full font-bold bg-gray-700 hover:bg-gray-600 text-white"
            >
              Back
            </button>
          )}
          
          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              disabled={currentStep === 2 && selectedPositions.length === 0}
              className={`px-6 py-2 rounded-full font-bold ml-auto ${
                currentStep === 2 && selectedPositions.length === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-yellow-600 hover:bg-yellow-500 text-white'
              }`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmitVotes}
              disabled={votingLoading || !selectedVoter}
              className={`px-8 py-3 rounded-full font-bold text-lg ml-auto ${
                votingLoading || !selectedVoter
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-yellow-600 hover:bg-yellow-500 text-white'
              }`}
            >
              {votingLoading ? 'Submitting...' : 'Submit Your Votes'}
            </button>
          )}
        </div>
        
        {votingError && (
          <div className="mt-4 text-red-400 text-center">
            Error submitting votes: {votingError.message}
          </div>
        )}
      </div>
    </div>
  );
};

// Component for displaying candidates for a position
const PositionCandidates = ({ position, selectedCandidate, onSelectCandidate }) => {
  const { data, loading, error } = useQuery(GET_POSITION_CANDIDATES, {
    variables: { electionPositionId: position.id }
  });
  
  return (
    <div className="mb-6 last:mb-0">
      <h3 className="text-xl font-bold mb-2 text-yellow-300">{position.position.name}</h3>
      
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-2">Loading candidates...</p>
        </div>
      )}
      
      {error && (
        <div className="text-red-400">
          Error loading candidates: {error.message}
        </div>
      )}
      
      {data?.positionCandidates?.length === 0 && (
        <div className="text-gray-400 italic">No candidates available for this position</div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {data?.positionCandidates?.map(candidate => (
          <div 
            key={candidate.id}
            onClick={() => onSelectCandidate(candidate)}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              selectedCandidate?.id === candidate.id
                ? 'bg-yellow-600 border-2 border-yellow-400' 
                : 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
            }`}
          >
            <h4 className="font-bold">
              {candidate.student.user.firstName} {candidate.student.user.lastName}
            </h4>
            <p className="text-sm text-gray-300">{candidate.student.institution.name}</p>
            {candidate.manifesto && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-400">Manifesto:</p>
                <p className="text-sm line-clamp-3">{candidate.manifesto}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VotePage;