import React from 'react';
import type { Coin, ChartDataPoint, SentimentData, PriceForecastData } from '../types';
import CoinList from './CoinList';
import PriceChart from './PriceChart';
import LoadingSpinner from './LoadingSpinner';
import NewsAndSentiment from './NewsAndSentiment';
import PriceForecast from './PriceForecast';

interface DashboardProps {
    // Coin list props
    coins: Coin[];
    isLoadingCoins: boolean;
    priceChanges: Record<string, 'up' | 'down'>;
    selectedCoinId?: string;
    onCoinSelect: (coin: Coin) => void;
    // Coin detail props
    selectedCoin: Coin | null;
    chartData: ChartDataPoint[];
    isLoadingChart: boolean;
    sentimentData: SentimentData | null;
    isLoadingSentiment: boolean;
    forecastData: PriceForecastData | null;
    isLoadingForecast: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    coins, isLoadingCoins, priceChanges, selectedCoinId, onCoinSelect,
    selectedCoin, chartData, isLoadingChart, sentimentData, isLoadingSentiment, forecastData, isLoadingForecast
}) => {

  if (isLoadingCoins) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
        <p className="ml-4 text-xl">Fetching Market Data...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <CoinList 
            coins={coins} 
            onCoinSelect={onCoinSelect} 
            selectedCoinId={selectedCoinId}
            priceChanges={priceChanges}
        />
      </div>
      <div className="lg:col-span-2 flex flex-col gap-8">
        <PriceChart coin={selectedCoin} chartData={chartData} isLoading={isLoadingChart} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <NewsAndSentiment data={sentimentData} isLoading={isLoadingSentiment} />
            <PriceForecast data={forecastData} isLoading={isLoadingForecast} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;