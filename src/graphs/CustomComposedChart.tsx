import React from 'react';
import { ComposedChart, Line, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomComposedChart = ({ data, xAxisKey, lineKeys, barKeys, areaKeys, colors, width = '100%', height = 300 }) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {lineKeys.map((key, index) => (
          <Line key={key} dataKey={key} stroke={colors[index % colors.length]} />
        ))}
        {barKeys.map((key, index) => (
          <Bar key={key} dataKey={key} fill={colors[index % colors.length]} />
        ))}
        {areaKeys.map((key, index) => (
          <Area key={key} dataKey={key} fill={colors[index % colors.length]} />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default CustomComposedChart;