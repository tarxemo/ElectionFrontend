// src/components/charts/ChartContainer.tsx
import React, { ReactElement } from 'react';
import { ResponsiveContainer } from 'recharts';

interface ChartContainerProps {
  children: ReactElement;
  height?: number | string;
  aspect?: number;
  className?: string;
  compact?: boolean; // ✅ Add this line
}


export const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  height = 400,
  aspect = 2,
  className = '',
}) => {
  return (
    <div 
      className={`relative bg-gray-900 rounded-lg p-4 shadow-lg ${className}`}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <ResponsiveContainer width="100%" height="100%" aspect={aspect}>
        {children}
      </ResponsiveContainer>
    </div>
  );
};
