import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomScatterChart = ({ data, xKey, yKey, colors, width = '100%', height = 300 }) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis dataKey={yKey} />
        <Tooltip />
        <Scatter data={data} fill={colors[0]} />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default CustomScatterChart;