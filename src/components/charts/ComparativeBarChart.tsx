// src/components/charts/ComparativeBarChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { ChartDataPoint } from './types';

interface ComparativeBarChartProps {
  data: ChartDataPoint[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  barLabel?: boolean;
  colors?: string[];
}

const COLORS = ['#FFE31A', '#FFA41A', '#FF6B1A', '#FF1A1A', '#1AFFE3'];

export const ComparativeBarChart: React.FC<ComparativeBarChartProps> = ({
  data,
  title,
  xAxisLabel,
  yAxisLabel,
  colors = COLORS,
}) => {
  return (
    <ChartContainer>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
        <Bar dataKey="value" name={title} animationDuration={1500}>
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};