// src/components/charts/StackedBarChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer } from './ChartContainer';

interface StackedBarChartProps {
  data: any[];
  bars: { dataKey: string; name: string; color: string }[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const StackedBarChart: React.FC<StackedBarChartProps> = ({
  data,
  bars,
  xAxisLabel,
  yAxisLabel,
}) => {
  return (
    <ChartContainer>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        stackOffset="sign"
      >
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
        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name}
            stackId="a"
            fill={bar.color}
            animationDuration={1500}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
};