// src/components/charts/TimeSeriesLineChart.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { TimeSeriesDataPoint } from './types';

interface TimeSeriesLineChartProps {
  data: TimeSeriesDataPoint[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string;
  strokeWidth?: number;
  hideLegend?: boolean;
  compact?: boolean;
  xAxisDataKey?: string;
  yAxisDataKey?: string;
  animationDuration?: number;
  responsive?: boolean;  // <== NEW: user can choose if they want Responsive behavior
}

export const TimeSeriesLineChart: React.FC<TimeSeriesLineChartProps> = ({
  data,
  title,
  xAxisLabel = 'X-Axis',
  yAxisLabel = 'Y-Axis',
  color = '#FFE31A',
  strokeWidth = 3,
  hideLegend = false,
  compact = false,
  xAxisDataKey = 'date',
  yAxisDataKey = 'value',
  animationDuration = 1500,
  responsive = false,   // default false
}) => {
  const Chart = (
    <LineChart
      width={responsive ? undefined : 600}
      height={responsive ? undefined : (compact ? 200 : 400)}
      data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
      <XAxis 
        dataKey={xAxisDataKey} 
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
        labelStyle={{ color, fontWeight: 'bold' }}
      />
      {!hideLegend && (
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
      )}
      <Line
        type="monotone"
        dataKey={yAxisDataKey}
        name={title}
        stroke={color}
        strokeWidth={strokeWidth}
        dot={{ fill: color, strokeWidth: 2, r: 4 }}
        activeDot={{ fill: color, strokeWidth: 2, r: 6 }}
        animationDuration={animationDuration}
      />
    </LineChart>
  );

  return (
    <div className="space-y-4">
      {title && <p className="text-center text-lg font-semibold text-gray-300">{title}</p>}
      <ChartContainer compact={compact}>
        {responsive ? (
          <div style={{ width: '100%', height: compact ? 200 : 400 }}>
            {Chart}
          </div>
        ) : (
          <div style={{ width: 600, height: compact ? 200 : 400 }}>
            {Chart}
          </div>
        )}
      </ChartContainer>
    </div>
  );
};
