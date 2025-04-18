// src/components/charts/ScatterChart.tsx
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer } from './ChartContainer';

interface ScatterChartProps {
  data: any[];
  xDataKey: string;
  yDataKey: string;
  zDataKey?: string;
  name: string;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string;
}

export const ScatterChartComponent: React.FC<ScatterChartProps> = ({
  data,
  xDataKey,
  yDataKey,
  zDataKey,
  name,
  title,
  xAxisLabel,
  yAxisLabel,
  color = '#FFE31A',
}) => {
  return (
    <ChartContainer>
      <ScatterChart
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
        <XAxis 
          dataKey={xDataKey} 
          name={xDataKey}
          label={{ value: xAxisLabel, position: 'bottom', fill: '#E5E7EB' }} 
          tick={{ fill: '#E5E7EB' }}
        />
        <YAxis 
          dataKey={yDataKey} 
          name={yDataKey}
          label={{ value: yAxisLabel, angle: -90, position: 'left', fill: '#E5E7EB' }} 
          tick={{ fill: '#E5E7EB' }}
        />
        {zDataKey && <ZAxis dataKey={zDataKey} range={[60, 400]} name={zDataKey} />}
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1F2937',
            borderColor: '#4B5563',
            borderRadius: '0.5rem',
          }}
          itemStyle={{ color: '#E5E7EB' }}
          labelStyle={{ color: '#FFE31A', fontWeight: 'bold' }}
          cursor={{ strokeDasharray: '3 3' }}
        />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
        <Scatter
          name={name}
          data={data}
          fill={color}
          animationDuration={1500}
        />
      </ScatterChart>
    </ChartContainer>
  );
};