import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CandidateComparisonChart = ({ data }: { data: { name: string; votes: number }[] }) => {
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
          width={80}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#1F2937',
            borderColor: '#374151',
            borderRadius: '0.5rem',
            color: '#F3F4F6'
          }}
          formatter={(value) => [`${value} votes`, 'Total Votes']}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          formatter={(value) => <span className="text-gray-300">{value}</span>}
        />
        <Bar
          dataKey="votes"
          name="Votes"
          fill="#FFE31A"
          radius={[0, 4, 4, 0]}
          animationDuration={1000}
        >
          {data.map((entry, index) => (
            <text
              key={index}   
              x={entry.votes + 15}
              y={index * 20 + 12}
              textAnchor="start"
              dominantBaseline="middle"
              fill="#F3F4F6"
              fontSize={12}
            >
              {entry.votes}
            </text>
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CandidateComparisonChart;