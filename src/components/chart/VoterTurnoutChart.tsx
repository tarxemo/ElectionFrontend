import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#FFE31A', '#4B5563'];

const VoterTurnoutChart = ({ data }: { data: { name: string; value: number }[] }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          dataKey="value"
          animationDuration={1000}
          animationEasing="ease-out"
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            backgroundColor: '#1F2937',
            borderColor: '#374151',
            borderRadius: '0.5rem',
            color: '#F3F4F6'
          }}
          formatter={(value) => [`${value}%`, 'Turnout']}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          formatter={(value) => <span className="text-gray-300">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default VoterTurnoutChart;