// src/components/charts/ComposedChart.tsx
import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area } from 'recharts';
import { ChartContainer } from './ChartContainer';

interface ComposedChartProps {
  data: any[];
  bars?: { dataKey: string; name: string; color: string }[];
  lines?: { dataKey: string; name: string; color: string; strokeWidth?: number }[];
  areas?: { dataKey: string; name: string; color: string }[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const ComposedChartComponent: React.FC<ComposedChartProps> = ({
  data,
  bars = [],
  lines = [],
  areas = [],
  xAxisLabel,
  yAxisLabel,
}) => {
  return (
    <ChartContainer>
      <ComposedChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
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
        
        {areas.map((area) => (
          <defs key={`area-${area.dataKey}`}>
            <linearGradient id={`color-${area.dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={area.color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={area.color} stopOpacity={0} />
            </linearGradient>
          </defs>
        ))}
        
        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name}
            barSize={20}
            fill={bar.color}
            animationDuration={1500}
          />
        ))}
        
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={line.strokeWidth || 2}
            animationDuration={1500}
          />
        ))}
        
        {areas.map((area) => (
          <Area
            key={area.dataKey}
            type="monotone"
            dataKey={area.dataKey}
            name={area.name}
            stroke={area.color}
            fillOpacity={1}
            fill={`url(#color-${area.dataKey})`}
            animationDuration={1500}
          />
        ))}
      </ComposedChart>
    </ChartContainer>
  );
};