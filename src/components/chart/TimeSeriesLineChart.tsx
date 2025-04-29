import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TimeSeriesLineChartProps {
  data: { date: string; value: number }[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string;
  hideLegend?: boolean;
  compact?: boolean;
}

const TimeSeriesLineChart: React.FC<TimeSeriesLineChartProps> = ({
  data,
  title,
  xAxisLabel,
  yAxisLabel,
  color = '#FFE31A',
  hideLegend = false,
  compact = false
}) => {
  return (
    <div className="w-full h-full">
      {title && <h3 className="text-lg font-medium text-white mb-2">{title}</h3>}
      <ResponsiveContainer width="100%" height={compact ? '90%' : '80%'}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            label={xAxisLabel ? { value: xAxisLabel, offset: -10, position: 'insideBottom', fill: '#9CA3AF' } : null}
            tick={{ fill: '#9CA3AF' }}
            axisLine={{ stroke: '#4B5563' }}
          />
          <YAxis 
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#9CA3AF' } : null}
            tick={{ fill: '#9CA3AF' }}
            axisLine={{ stroke: '#4B5563' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1F2937',
              borderColor: '#374151',
              borderRadius: '0.5rem',
              color: '#F3F4F6'
            }}
            formatter={(value) => [`${value}`, yAxisLabel || 'Value']}
            labelFormatter={(label) => `${xAxisLabel || 'Date'}: ${label}`}
          />
          {!hideLegend && (
            <Legend 
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => <span className="text-gray-300">{value}</span>}
            />
          )}
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            activeDot={{ r: 6, fill: color }}
            dot={{ r: 3, fill: color }}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeSeriesLineChart;