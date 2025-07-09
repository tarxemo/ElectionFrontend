// src/components/charts/AreaChart.tsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { TimeSeriesDataPoint } from './types';

interface AreaChartProps {
  data: TimeSeriesDataPoint[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string;
}

export const AreaChartComponent: React.FC<AreaChartProps> = ({
  data,
  xAxisLabel,
  yAxisLabel,
  color = '#FFE31A',
}) => {
  return (
    <ChartContainer>
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
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
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          fillOpacity={1}
          fill="url(#colorValue)"
          animationDuration={1500}
        />
      </AreaChart>
    </ChartContainer>
  );
};