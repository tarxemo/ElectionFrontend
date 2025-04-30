// src/utils/formatUtils.ts
export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };