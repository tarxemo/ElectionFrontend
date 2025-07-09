import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CollegeData {
  name: string;
  votes: number;
}

const CollegeRadialChart: React.FC<{ data: CollegeData[] }> = ({ data }) => {
  // Prepare data with calculated percentages
  const maxVotes = Math.max(...data.map(item => item.votes));
  const chartData = data.map(item => ({
    ...item,
    percent: (item.votes / maxVotes) * 100,
    fill: '#FFE31A'
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadialBarChart
        innerRadius="20%"
        outerRadius="90%"
        data={chartData}
        startAngle={180}
        endAngle={-180}
        barSize={20}
      >
        <PolarAngleAxis 
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar
          background
          dataKey="percent"
          cornerRadius={10}
          label={{
            position: 'insideStart',
            // formatter: (value, index) => chartData[index].name,
            fill: '#FFFFFF'
          }}
          animationDuration={1500}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#1F2937',
            borderColor: '#374151',
            borderRadius: '0.5rem',
            color: '#F3F4F6'
          }}
          formatter={(_value, _name, props) => {
            const index = props.payload.index;
            return [`${chartData[index].votes} votes`, 'Total Votes'];
          }}          
          labelFormatter={(label) => `College: ${label}`}
        />
        <Legend 
          iconSize={10}
          layout="vertical"
          verticalAlign="middle"
          wrapperStyle={{
            paddingLeft: '20px'
          }}
          formatter={(value, _entry, index) => (
            <span className="text-gray-300">
              {value}: {chartData[index].votes.toLocaleString()}
            </span>
          )}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

export default CollegeRadialChart;