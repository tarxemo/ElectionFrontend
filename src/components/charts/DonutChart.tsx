// src/components/charts/DonutChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { ChartDataPoint } from './types';

const COLORS = ['#FFE31A', '#FFA41A', '#FF6B1A', '#FF1A1A', '#1AFFE3', '#1AFF6B'];

interface DonutChartProps {
  data: ChartDataPoint[];
  title?: string;
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  title,
  colors = COLORS,
  innerRadius = 70,
  outerRadius = 90,
}) => {
  return (
    <ChartContainer aspect={1.5}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          nameKey="name"
          animationDuration={1500}
          animationBegin={0}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
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
      </PieChart>
    </ChartContainer>
  );
};