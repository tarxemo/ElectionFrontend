// src/components/charts/MultiLineChart.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer } from './ChartContainer';

interface MultiLineChartProps {
  data: any[];
  lines: { dataKey: string; name: string; color: string; strokeWidth?: number }[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const MultiLineChart: React.FC<MultiLineChartProps> = ({
  data,
  lines,
  xAxisLabel,
  yAxisLabel,
}) => {
  return (
    <ChartContainer>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
        <XAxis 
          dataKey="name" 
          label={{ value: xAxisLabel, position: 'bottom', fill: '#E5E7EB' }} 
          tick={{ fill: '#E5E7EB' }}
        />
        <YAxis 
          label={{ value: yAxisLabel, angle: -90, position: 'left', fill: '#E5E7EB' }} 
          tick={{ fill: '#E5E7EB' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1F2937',
            borderColor: '#4B5563',
            borderRadius: '0.5rem',
          }}
          itemStyle={{ color: '#E5E7EB' }}
          labelStyle={{ color: '#FFE31A', fontWeight: 'bold' }}
        />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={line.strokeWidth || 2}
            dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
            activeDot={{ fill: line.color, strokeWidth: 2, r: 6 }}
            animationDuration={1500}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
};