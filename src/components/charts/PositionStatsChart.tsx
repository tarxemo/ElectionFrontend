// components/charts/PositionStatsChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PositionStatsChartProps {
  data: Array<{
    level: string;
    count: number;
    withElections: number;
    withCandidates: number;
  }>;
}

export const PositionStatsChart: React.FC<PositionStatsChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="level" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" name="Total Positions" fill="#8884d8" />
        <Bar dataKey="withElections" name="With Elections" fill="#82ca9d" />
        <Bar dataKey="withCandidates" name="With Candidates" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
};