
import React from 'react';

const PriceChange: React.FC<{ change: number }> = ({ change }) => {
  const isPositive = change >= 0;
  return (
    <span className={`inline-flex items-center font-semibold text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
      {isPositive ? '▲' : '▼'}
      <span className="ml-1">{Math.abs(change).toFixed(2)}%</span>
    </span>
  );
};

export default PriceChange;
