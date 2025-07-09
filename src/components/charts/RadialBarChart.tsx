import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
  Cell,
} from 'recharts';
import { ChartContainer } from './ChartContainer';
import { ChartDataPoint } from './types';

const COLORS = ['#FFE31A', '#FFA41A', '#FF6B1A', '#FF1A1A', '#1AFFE3'];

interface RadialBarChartProps {
  data: ChartDataPoint[];
  title?: string;
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
}

export const RadialBarChartComponent: React.FC<RadialBarChartProps> = ({
  data,
  colors = COLORS,
  innerRadius = 20,
  outerRadius = 140,
}) => {
  return (
    <ChartContainer aspect={1.5}>
      <RadialBarChart
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <RadialBar
          {...{
            minAngle: 15,
            label: { fill: '#1F2937', position: 'insideStart' },
            background: true,
            clockWise: true,
            dataKey: 'value',
            animationDuration: 1500,
          }}
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </RadialBar>
        <Legend
          iconSize={10}
          width={120}
          height={140}
          layout="vertical"
          verticalAlign="middle"
          wrapperStyle={{
            top: 0,
            right: 0,
            backgroundColor: '#1F2937',
            border: '1px solid #4B5563',
            borderRadius: '0.5rem',
            padding: '0.5rem',
          }}
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
      </RadialBarChart>
    </ChartContainer>
  );
};
