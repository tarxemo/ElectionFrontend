import React from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';

const CustomRadialBarChart = ({ data, dataKey, nameKey, colors, width = '100%', height = 300 }) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <RadialBarChart innerRadius="10%" outerRadius="80%" data={data}>
        <RadialBar
          dataKey={dataKey}
          nameKey={nameKey}
          fill={colors[0]}
        />
        <Legend />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

export default CustomRadialBarChart;