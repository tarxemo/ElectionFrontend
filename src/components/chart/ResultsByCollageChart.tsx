import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ResultsByCollegeProps {
  data: { name: string; votes: number }[];
}

const ResultsByCollegeChart: React.FC<ResultsByCollegeProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          type="number" 
          tick={{ fill: '#9CA3AF' }} 
          axisLine={{ stroke: '#4B5563' }} 
        />
        <YAxis 
          dataKey="name" 
          type="category" 
          tick={{ fill: '#9CA3AF' }} 
          axisLine={{ stroke: '#4B5563' }} 
          width={100}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#1F2937',
            borderColor: '#374151',
            borderRadius: '0.5rem',
            color: '#F3F4F6'
          }}
          formatter={(value) => [`${value} votes`, 'Total Votes']}
          labelFormatter={(label) => `College: ${label}`}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          formatter={() => <span className="text-gray-300">Votes by College</span>}
        />
        <Bar
          dataKey="votes"
          name="Votes"
          fill="#FFE31A"
          radius={[0, 4, 4, 0]}
          animationDuration={1500}
        >
          {data.map((entry, index) => (
            <text
              key={`value-${index}`}
              x={entry.votes + 50} // Position text slightly right of the bar
              y={index * 20 + 12}
              textAnchor="start"
              dominantBaseline="middle"
              fill="#F3F4F6"
              fontSize={12}
            >
              {entry.votes.toLocaleString()}
            </text>
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ResultsByCollegeChart;