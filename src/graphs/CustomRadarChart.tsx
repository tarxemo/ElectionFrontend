import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

const CustomRadarChart = ({ data, dataKey, angleKey, colors, width = '100%', height = 300 }) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <RadarChart outerRadius={90} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey={angleKey} />
        <PolarRadiusAxis />
        <Radar
          dataKey={dataKey}
          stroke={colors[0]}
          fill={colors[0]}
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default CustomRadarChart;