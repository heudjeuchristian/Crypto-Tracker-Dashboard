
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Coin, ChartDataPoint } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { formatCurrency } from '../utils/formatters';
import PriceChange from './PriceChange';

interface PriceChartProps {
  coin: Coin | null;
  chartData: ChartDataPoint[];
  isLoading: boolean;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800/80 p-3 rounded-lg border border-gray-600 shadow-lg backdrop-blur-sm">
        <p className="label text-gray-300">{`${label}`}</p>
        <p className="intro font-bold text-cyan-400">{`Price: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

const PriceChart: React.FC<PriceChartProps> = ({ coin, chartData, isLoading }) => {
  if (!coin) {
    return (
      <div className="bg-gray-800/50 rounded-lg shadow-lg p-6 h-full flex items-center justify-center backdrop-blur-md border border-gray-700">
        <p className="text-gray-400">Select a coin to view its chart</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-lg shadow-lg p-4 sm:p-6 h-[500px] flex flex-col backdrop-blur-md border border-gray-700">
      <div>
        <h2 className="text-xl font-bold">{coin.name} ({coin.symbol.toUpperCase()})</h2>
        <div className="flex items-baseline space-x-2 mt-1 mb-2">
            <p className="text-3xl font-mono">{formatCurrency(coin.price)}</p>
            <PriceChange change={coin.priceChange24h} />
        </div>
        <p className="text-gray-400 text-sm mb-4">90-Day Price Chart</p>
      </div>
      
      {isLoading && (
         <div className="flex-grow flex justify-center items-center">
            <LoadingSpinner />
            <p className="ml-4 text-lg">Loading Chart Data...</p>
         </div>
      )}

      {!isLoading && chartData.length > 0 && (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 5,
              right: 20,
              left: 20,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
            <XAxis 
                dataKey="date" 
                stroke="#a0aec0" 
                tick={{ fontSize: 12 }} 
                tickFormatter={(str) => {
                    const date = new Date(str);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }}
            />
            <YAxis 
                stroke="#a0aec0" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
                domain={['dataMin', 'dataMax']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="price" stroke="#06b6d4" fillOpacity={1} fill="url(#colorPrice)" />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {!isLoading && chartData.length === 0 && (
         <div className="flex-grow flex justify-center items-center">
            <p className="text-gray-500">Could not load chart data.</p>
         </div>
      )}
    </div>
  );
};

export default PriceChart;
