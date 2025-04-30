import { gql } from '@apollo/client';

// 1. Total Votes per Candidate in a Specific Election
export const GET_TOTAL_VOTES_PER_CANDIDATE = gql`
  query TotalVotesPerCandidate($electionId: ID!) {
    totalVotesPerCandidate(electionId: $electionId) {
      studentUsername
      totalVotes
    }
  }
`;

// 2. Vote Distribution Across Colleges in a University Election
export const GET_VOTE_DISTRIBUTION_ACROSS_COLLEGES = gql`
  query VoteDistributionAcrossColleges($electionId: ID!) {
    voteDistributionAcrossColleges(electionId: $electionId) {
      name
      totalVotes
    }
  }
`;

// 3. Vote Trends Over Time for a Specific Election
export const GET_VOTE_TRENDS_OVER_TIME = gql`
  query VoteTrendsOverTime($electionId: ID!) {
    voteTrendsOverTime(electionId: $electionId) {
      timestamp
      totalVotes
    }
  }
`;

// 4. Comparison of Vote Counts Between Hostels in a College Election
export const GET_VOTE_COMPARISON_BETWEEN_HOSTELS = gql`
  query VoteComparisonBetweenHostels($electionId: ID!) {
    voteComparisonBetweenHostels(electionId: $electionId) {
      name
      totalVotes
    }
  }
`;

// 5. Leader Ratings Over Time
export const GET_LEADER_RATINGS_OVER_TIME = gql`
  query LeaderRatingsOverTime($candidateId: ID!) {
    leaderRatingsOverTime(candidateId: $candidateId) {
      timestamp
      averageRating
    }
  }
`;

// 6. Comparison of Average Ratings Between Candidates in a College
export const GET_AVERAGE_RATINGS_COMPARISON = gql`
  query AverageRatingsComparison($collegeId: ID!) {
    averageRatingsComparison(collegeId: $collegeId) {
      studentUsername
      averageRating
    }
  }
`;

// 7. Promise Implementation Status for a Candidate
export const GET_PROMISE_IMPLEMENTATION_STATUS = gql`
  query PromiseImplementationStatus($candidateId: ID!) {
    promiseImplementationStatus(candidateId: $candidateId) {
      status
      count
    }
  }
`;

// 8. Voter Turnout by College in a University Election
export const GET_VOTER_TURNOUT_BY_COLLEGE = gql`
  query VoterTurnoutByCollege($electionId: ID!) {
    voterTurnoutByCollege(electionId: $electionId) {
      name
      totalVoters
      totalVotes
    }
  }
`;

// 9. Top 5 Candidates by Votes in a Specific Election
export const GET_TOP_CANDIDATES_BY_VOTES = gql`
  query TopCandidatesByVotes($electionId: ID!) {
    topCandidatesByVotes(electionId: $electionId) {
      studentUsername
      totalVotes
    }
  }
`;

// 10. Vote Distribution by Position in an Election
export const GET_VOTE_DISTRIBUTION_BY_POSITION = gql`
  query VoteDistributionByPosition($electionId: ID!) {
    voteDistributionByPosition(electionId: $electionId) {
      name
      totalVotes
    }
  }
`;

// 11. Comparison of Vote Counts Between Universities
export const GET_VOTE_COMPARISON_BETWEEN_UNIVERSITIES = gql`
  query VoteComparisonBetweenUniversities($electionId: ID!) {
    voteComparisonBetweenUniversities(electionId: $electionId) {
      name
      totalVotes
    }
  }
`;

// 12. Trend of Votes for a Candidate Over Multiple Elections
export const GET_VOTES_TREND_FOR_CANDIDATE = gql`
  query VotesTrendForCandidate($candidateId: ID!) {
    votesTrendForCandidate(candidateId: $candidateId) {
      electionName
      totalVotes
    }
  }
`;

// 13. Comparison of Promise Implementation Status Between Candidates
export const GET_PROMISE_IMPLEMENTATION_COMPARISON = gql`
  query PromiseImplementationComparison($electionId: ID!) {
    promiseImplementationComparison(electionId: $electionId) {
      studentUsername
      completedPromises
      pendingPromises
    }
  }
`;

// 14. Voter Turnout by Hostel in a College Election
export const GET_VOTER_TURNOUT_BY_HOSTEL = gql`
  query VoterTurnoutByHostel($electionId: ID!) {
    voterTurnoutByHostel(electionId: $electionId) {
      name
      totalVoters
      totalVotes
    }
  }
`;

// 15. Comparison of Ratings Between Hostel Leaders
export const GET_RATINGS_COMPARISON_BETWEEN_HOSTEL_LEADERS = gql`
  query RatingsComparisonBetweenHostelLeaders($hostelId: ID!) {
    ratingsComparisonBetweenHostelLeaders(hostelId: $hostelId) {
      studentUsername
      averageRating
    }
  }
`;

// 16. Trend of Ratings for a Leader Over Time
export const GET_RATINGS_TREND_FOR_LEADER = gql`
  query RatingsTrendForLeader($candidateId: ID!) {
    ratingsTrendForLeader(candidateId: $candidateId) {
      timestamp
      averageRating
    }
  }
`;

// 17. Comparison of Votes Between Candidates for a Specific Position
export const GET_VOTES_COMPARISON_FOR_POSITION = gql`
  query VotesComparisonForPosition($positionId: ID!) {
    votesComparisonForPosition(positionId: $positionId) {
      studentUsername
      totalVotes
    }
  }
`;

// 18. Voter Turnout by University in All Elections
export const GET_VOTER_TURNOUT_BY_UNIVERSITY = gql`
  query VoterTurnoutByUniversity {
    voterTurnoutByUniversity {
      name
      totalVoters
      totalVotes
    }
  }
`;

// 19. Comparison of Votes Between Colleges in a University Election
export const GET_VOTES_COMPARISON_BETWEEN_COLLEGES = gql`
  query VotesComparisonBetweenColleges($electionId: ID!) {
    votesComparisonBetweenColleges(electionId: $electionId) {
      name
      totalVotes
    }
  }
`;

// 20. Trend of Votes for a Position Over Multiple Elections
export const GET_VOTES_TREND_FOR_POSITION = gql`
  query VotesTrendForPosition($positionId: ID!) {
    votesTrendForPosition(positionId: $positionId) {
      electionName
      totalVotes
    }
  }
`;

// Basic List and Detail Queries
export const GET_COLLEGE_LIST = gql`
  query CollegeList {
    collegeList {
      id
      name
      university {
        id
        name
      }
    }
  }
`;

export const GET_COLLEGE_DETAILS = gql`
  query CollegeDetails($collegeId: ID!) {
    collegeDetails(collegeId: $collegeId) {
      id
      name
      description
      university {
        id
        name
      }
    }
  }
`;

export const GET_CANDIDATE_LIST = gql`
  query CandidateList {
    candidateList {
      id
      student {
        user {
          username
          firstName
          lastName
        }
      }
      position {
        id
        name
      }
    }
  }
`;

export const GET_CANDIDATE_DETAILS = gql`
  query CandidateDetails($candidateId: ID!) {
    candidateDetails(candidateId: $candidateId) {
      id
      student {
        user {
          username
          firstName
          lastName
        }
        hostel {
          id
          name
        }
      }
      position {
        id
        name
      }
      manifesto
    }
  }
`;

export const GET_UNIVERSITY_DETAILS = gql`
  query UniversityDetails($universityId: ID!) {
    universityDetails(universityId: $universityId) {
      id
      name
      description
    }
  }
`;

export const GET_HOSTEL_LIST = gql`
  query HostelList {
    hostelList {
      id
      name
      college {
        id
        name
      }
    }
  }
`;

export const GET_HOSTEL_DETAILS = gql`
  query HostelDetails($hostelId: ID!) {
    hostelDetails(hostelId: $hostelId) {
      id
      name
      description
      college {
        id
        name
      }
    }
  }
`;

export const GET_HOSTELS_FOR_COLLEGE = gql`
  query HostelsForCollege($collegeId: ID!) {
    hostelsForCollege(collegeId: $collegeId) {
      id
      name
    }
  }
`;

export const GET_POSITION_LIST = gql`
  query PositionList {
    positionList {
      id
      name
      level
      description
    }
  }
`;


export const GET_ELECTION_LIST = gql`
  query ElectionList {
    electionList {
      id
      name
      level
      startDate
      endDate
    }
  }
`;

export const GET_ELECTION_DETAILS = gql`
  query ElectionDetails($electionId: ID!) {
    electionDetails(electionId: $electionId) {
      id
      name
      level
      startDate
      endDate
      description
      positions {
        id
        name
      }
    }
  }
`;


// Won leaders query
export const GET_WON_LEADERS = gql`
  query WonLeaders($electionId: ID!, $collegeId: ID) {
    wonLeaders(electionId: $electionId, collegeId: $collegeId) {
      id
      student {
        user {
          username
          firstName
          lastName
        }
      }
      position {
        id
        name
      }
      voteCount
    }
  }
`;

// Hostel leader stats query
export const GET_HOSTEL_LEADER_STATS = gql`
  query HostelLeaderStats($hostelId: ID!) {
    hostelLeaderStats(hostelId: $hostelId) {
      studentUsername
      positionName
      voteCount
      avgRating
    }
  }
`;

export const GET_ELECTION_STATS = gql`
  query ElectionStats {
    electionStats {
      activeElections
      totalVotes
      registeredVoters
      totalCandidates
      participationRate
    }
  }
`;

export const GET_ALL_WON_LEADERS = gql`
  query GetAllWonLeaders($filters: LeaderFilters) {
    allWonLeaders(filters: $filters) {
      leaders {
        id
        student {
          user {
            username
            firstName
            lastName
          }
          college {
            id
            name
          }
          hostel {
            name
          }
        }
        position {
          id
          name
          level
        }
        voteCount
        rating
        promisesCompleted
      }
      totalCount
    }
  }
`;

export const GET_LEADER_STATS = gql`
  query GetLeaderStats {
    leaderStats {
      totalLeaders
      avgRating
      avgPromiseCompletion
      totalPositions
    }
  }
`;


export const GET_ALL_POSITIONS = gql`
  query GetAllPositions(
    $filters: PositionFilterInput
    $first: Int
    $skip: Int
  ) {
    allPositions(
      filters: $filters
      first: $first
      skip: $skip
    ) {
      id
      name
      description
      level {
        level
      }
      institution {
        id
        name
        level {
          level
        }
        parent {
          id
          name
        }
      }
      electionCount
      candidateCount
    }
  }
`;

export const GET_POSITION_STATS = gql`
  query GetPositionStats {
    positionStats {
      level
      count
      withElections
      withCandidates
    }
  }
`;

export const GET_INSTITUTIONS_BY_LEVEL = gql`
  query GetInstitutionsByLevel($level: String!) {
    institutionsByLevel(level: $level) {
      id
      name
      parent {
        id
        name
      }
    }
  }
`;

export const GET_ACADEMIC_YEARS = gql`
  query GetAcademicYears {
    academicYears {
      id
      name
      isCurrent
    }
  }
`;

export const GET_ACADEMIC_YEAR = gql`
  query GetAcademicYear($isCurrent: Boolean) {
    academicYears(isCurrent: $isCurrent) {
      id
      name
      isCurrent
    }
  }
`;

export const GET_ALL_INSTITUTIONS = gql `
query MyQuery {
  allInstitutions {
    createdAt
    id
    name
    studentCount
    children {
      description
      createdAt
      id
      name
      studentCount
      children {
        description
        createdAt
        id
        leaderCount
        name
        studentCount
      }
    }
  }
}`

// api/queries.ts
export const GET_POSITION_DETAILS = gql`
  query GetPositionDetails(
    $positionId: ID!, 
    $electionId: ID, 
    $academicYearId: ID  
  ) {
    positionDetails(
      positionId: $positionId, 
      electionId: $electionId,
      academicYearId: $academicYearId 
    ) {
      position {
        id
        name
        description
        level {
          level
        }
        institution {
          id
          name
        }
      }
      isElectionActive
      totalVoters
      totalVotes
      winner {
        id
        student {
          user {
            firstName
            lastName
          }
        }
        manifesto
        voteCount
        votePercentage
      }
      candidates {
        id
        student {
          user {
            firstName
            lastName
            email
          }
          institution {
            name
          }
        }
        manifesto
        voteCount
        votePercentage
        isWinner
        promisesCount
        rating
      }
      voteTimeSeries {
        timestamp
        count
        candidateId
      }
    }
  }
`;

export const SUBSCRIBE_TO_VOTES = gql`
  subscription OnVoteAdded($positionId: ID!, $electionId: ID!) {
    voteAdded(positionId: $positionId, electionId: $electionId) {
      candidateId
      timestamp
    }
  }
`;


export const GET_INSTITUTION_BY_LEVEL = gql`
  query GetInstitutionByLevel($level: String!) {
    institutionsByLevel(level: $level) {
      id
      name
      parent {
        id
        name
      }
    }
  }
`;



export const GET_ELECTION_CONTESTANTS = gql`
  query GetElectionContestants(
    $institutionId: ID!
    $electionId: ID
    $positionId: ID
    $academicYearId: ID
  ) {
    electionContestants(
      institutionId: $institutionId
      electionId: $electionId
      positionId: $positionId
      academicYearId: $academicYearId
    ) {
      id
      isApproved
      manifesto
      student {
        user {
          firstName
          lastName
          username
        }
      }
      electionPosition {
        position {
          name
        }
        election {
          name
          academicYear {
            name
          }
        }
      }
    }
  }
`;



import { gql } from '@apollo/client';

export const GET_INSTITUTION_DETAILS = gql`
  query GetInstitutionDetails($institutionId: ID!) {
    institutionDetails(institutionId: $institutionId) {
      totalStudents
      activeElections
      totalVotesCast
      voterTurnout
      positionsAvailable
      currentLeaders
    }
  }
`;

export const GET_COLLEGE_DISTRIBUTION = gql`
  query GetCollegeDistribution($parentInstitutionId: ID) {
    collegeDistribution(parentInstitutionId: $parentInstitutionId) {
      name
      studentCount
      percentage
    }
  }
`;

export const GET_ELECTION_TRENDS = gql`
  query GetElectionTrends($institutionId: ID!) {
    electionTrends(institutionId: $institutionId) {
      year
      elections
      voters
      turnout
    }
  }
`;