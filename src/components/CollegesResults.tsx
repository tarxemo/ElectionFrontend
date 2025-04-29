// src/components/CollegeComponents.tsx
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';

const GET_COLLEGES = gql`
  query GetAllColleges {
    allColleges {
      college {
        id
        name
      }
    }
  }
`;

type College = {
  college: {
    id: number;
    name: string;
  };
};

export function CollegeList() {
  const { loading, error, data } = useQuery<{ allColleges: College[] }>(GET_COLLEGES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h2>Colleges</h2>
      <ul>
        {data?.allColleges.map(({ college }) => (
          <li key={college.id}>
            <Link to={`/colleges/${college.id}/positions`}>
              {college.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const GET_COLLEGE_POSITIONS = gql`
  query GetCollegePositions($collegeId: Int!) {
    collegePositions(collegeId: $collegeId) {
      id
      position {
        id
        name
      }
    }
  }
`;

type CollegePosition = {
  id: number;
  position: {
    id: number;
    name: string;
  };
};

interface CollegePositionsProps {
  collegeId: number;
}

export function CollegePositions({ collegeId }: CollegePositionsProps) {
  const { loading, error, data } = useQuery<{ collegePositions: CollegePosition[] }>(
    GET_COLLEGE_POSITIONS,
    { variables: { collegeId } }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h2>Election Positions</h2>
      <ul>
        {data?.collegePositions.map((position) => (
          <li key={position.id}>
            <Link to={`/positions/${position.position.id}/results`}>
              {position.position.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const GET_POSITION_RESULTS = gql`
  query GetPositionResults($positionId: Int!) {
    positionResults(positionId: $positionId) {
      candidate {
        student {
          user {
            firstName
            lastName
          }
        }
      }
      totalVotes
      percentage
      positionRank
      isWinner
    }
  }
`;

type PositionResult = {
  candidate: {
    id: number;
    student: {
      user: {
        firstName: string;
        lastName: string;
      };
    };
  };
  totalVotes: number;
  percentage: number;
  positionRank: number;
  isWinner: boolean;
};

interface PositionResultsProps {
  positionId: number;
}

function PositionResults({ positionId }: PositionResultsProps) {
  const { loading, error, data } = useQuery<{ positionResults: PositionResult[] }>(
    GET_POSITION_RESULTS,
    { variables: { positionId } }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h2>Election Results</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Candidate</th>
            <th>Votes</th>
            <th>Percentage</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data?.positionResults.map((result) => (
            <tr key={result.candidate.id} className={result.isWinner ? 'winner' : ''}>
              <td>{result.positionRank}</td>
              <td>
                {result.candidate.student.user.firstName} {result.candidate.student.user.lastName}
              </td>
              <td>{result.totalVotes}</td>
              <td>{result.percentage}%</td>
              <td>{result.isWinner ? 'Winner' : 'Candidate'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PositionResults;
