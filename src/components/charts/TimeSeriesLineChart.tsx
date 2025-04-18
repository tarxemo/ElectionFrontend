// src/components/charts/TimeSeriesLineChart.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { TimeSeriesDataPoint } from './types';

interface TimeSeriesLineChartProps {
  data: TimeSeriesDataPoint[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  lineColor?: string;
  strokeWidth?: number;
}

export const TimeSeriesLineChart: React.FC<TimeSeriesLineChartProps> = ({
  data,
  title,
  xAxisLabel,
  yAxisLabel,
  lineColor = '#FFE31A',
  strokeWidth = 3,
}) => {
  return (
    <ChartContainer>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
        <XAxis 
          dataKey="date" 
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
        <Line
          type="monotone"
          dataKey="value"
          name={title}
          stroke={lineColor}
          strokeWidth={strokeWidth}
          dot={{ fill: lineColor, strokeWidth: 2, r: 4 }}
          activeDot={{ fill: lineColor, strokeWidth: 2, r: 6 }}
          animationDuration={1500}
        />
      </LineChart>
    </ChartContainer>
  );
};