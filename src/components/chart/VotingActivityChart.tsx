import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const VotingActivityChart = ({ data }: { data: { date: string; value: number }[] }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FFE31A" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#FFE31A" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="date" 
          tick={{ fill: '#9CA3AF' }} 
          axisLine={{ stroke: '#4B5563' }} 
        />
        <YAxis 
          tick={{ fill: '#9CA3AF' }} 
          axisLine={{ stroke: '#4B5563' }} 
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#1F2937',
            borderColor: '#374151',
            borderRadius: '0.5rem',
            color: '#F3F4F6'
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#FFE31A"
          fillOpacity={1}
          fill="url(#colorValue)"
          activeDot={{ r: 6, fill: '#FFE31A', stroke: '#000' }}
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default VotingActivityChart;