// src/components/CollegeList.tsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_COLLEGES_WITH_STUDENTS } from '../api/queries';

interface College {
  id: string;
  name: string;
}

interface CollegeData {
  allColleges: College[];
}

const CollegeList: React.FC = () => {
  const { loading, error, data } = useQuery<CollegeData>(GET_COLLEGES_WITH_STUDENTS);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold">Error Loading Data</p>
            <p>{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.allColleges?.length) {
    return (
      <div className="bg-gray-900 text-yellow-400 p-6 rounded-lg shadow-lg">
        <p className="text-xl">No colleges found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-yellow-400 mb-8">Colleges Directory</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.allColleges.map((college) => (
          <div 
            key={college.id}
            className="bg-gray-900 rounded-lg border border-gray-800 hover:border-yellow-400 transition-colors duration-300 overflow-hidden"
          >
            <div className="p-4 flex flex-col h-full">
              <h2 className="text-lg font-semibold text-yellow-400 mb-4 line-clamp-2">
                {college.name}
              </h2>
              <div className="mt-auto flex justify-end">
                <button 
                  className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-medium py-2 px-4 rounded transition-colors duration-300"
                  onClick={() => {
                    // Navigate to college details
                    console.log('View details for:', college.id);
                  }}
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollegeList;