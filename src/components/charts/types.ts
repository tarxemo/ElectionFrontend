// src/components/charts/types.ts
export interface ChartDataPoint {
    name: string;
    value: number;
    [key: string]: any; // Additional properties
  }
  
  export interface TimeSeriesDataPoint {
    date: string;
    value: number;
    [key: string]: any; // Additional properties
  }
  
  export interface ComparativeDataPoint {
    category: string;
    values: {
      [key: string]: number;
    };
  }