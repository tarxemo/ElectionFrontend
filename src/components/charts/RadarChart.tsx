// src/components/charts/RadarChart.tsx
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend } from 'recharts';
import { ChartContainer } from './ChartContainer';

interface RadarChartProps {
  data: any[];
  dataKey: string;
  title?: string;
  color?: string;
  fillOpacity?: number;
}

export const RadarChartComponent: React.FC<RadarChartProps> = ({
  data,
  dataKey,
  title,
  color = '#FFE31A',
  fillOpacity = 0.6,
}) => {
  return (
    <ChartContainer aspect={1.5}>
      <RadarChart
        cx="50%"
        cy="50%"
        outerRadius="80%"
        data={data}
      >
        <PolarGrid stroke="#4B5563" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#E5E7EB' }} />
        <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={{ fill: '#E5E7EB' }} />
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
        <Radar
          name={title}
          dataKey={dataKey}
          stroke={color}
          fill={color}
          fillOpacity={fillOpacity}
          animationDuration={1500}
        />
      </RadarChart>
    </ChartContainer>
  );
};