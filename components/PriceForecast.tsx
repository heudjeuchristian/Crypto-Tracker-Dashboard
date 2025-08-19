import React from 'react';
import type { PriceForecastData } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { formatCurrency } from '../utils/formatters';

interface PriceForecastProps {
  data: PriceForecastData | null;
  isLoading: boolean;
}

const PriceForecast: React.FC<PriceForecastProps> = ({ data, isLoading }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg shadow-lg p-4 sm:p-6 flex flex-col backdrop-blur-md border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-gray-200">AI Price Forecast</h2>
      
      {isLoading && (
        <div className="flex-grow flex justify-center items-center min-h-[200px]">
          <LoadingSpinner />
          <p className="ml-4 text-lg">Generating Forecast...</p>
        </div>
      )}

      {!isLoading && data && (
        <div className="flex flex-col h-full">
          <div>
            <p className="text-gray-300 italic">{data.summary}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 my-6">
            <div className="bg-green-500/10 p-3 rounded-lg text-center">
              <p className="text-sm text-green-400 font-semibold">Support</p>
              <p className="text-lg font-mono font-bold">{formatCurrency(data.support)}</p>
            </div>
            <div className="bg-red-500/10 p-3 rounded-lg text-center">
              <p className="text-sm text-red-400 font-semibold">Resistance</p>
              <p className="text-lg font-mono font-bold">{formatCurrency(data.resistance)}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1 text-center">AI Confidence</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-cyan-400 h-2.5 rounded-full" 
                style={{ width: `${data.confidence}%` }}
              ></div>
            </div>
            <p className="text-center font-bold text-lg mt-1">{data.confidence}%</p>
          </div>

          <div className="mt-auto pt-4">
             <p className="text-xs text-gray-500 text-center">
                Disclaimer: This is a simulated forecast for demonstration purposes and is not financial advice.
             </p>
          </div>

        </div>
      )}

      {!isLoading && !data && (
        <div className="flex-grow flex justify-center items-center min-h-[200px]">
          <p className="text-gray-500">Could not load forecast data.</p>
        </div>
      )}
    </div>
  );
};

export default PriceForecast;
