import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import { fetchCoinData, fetchHistoricalData, fetchCoinNewsAndSentiment, fetchPriceForecast } from './services/geminiService';
import type { Coin, ChartDataPoint, SentimentData, PriceForecastData } from './types';
import ChatAssistant from './components/ChatAssistant';

const App: React.FC = () => {
  // Coin list state
  const [coins, setCoins] = useState<Coin[]>([]);
  const [priceChanges, setPriceChanges] = useState<Record<string, 'up' | 'down'>>({});
  const [isLoadingCoins, setIsLoadingCoins] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Selected coin and details state (lifted from Dashboard)
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [forecastData, setForecastData] = useState<PriceForecastData | null>(null);
  const [isLoadingChart, setIsLoadingChart] = useState<boolean>(false);
  const [isLoadingSentiment, setIsLoadingSentiment] = useState<boolean>(false);
  const [isLoadingForecast, setIsLoadingForecast] = useState<boolean>(false);

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleRefresh = useCallback(async (isManual: boolean = false) => {
    if (isRefreshing) return;

    if (isManual) {
      setIsRefreshing(true);
    }

    const newCoinData = await fetchCoinData();

    if (newCoinData && newCoinData.length > 0) {
      setCoins(prevCoins => {
        if (prevCoins.length > 0) {
          const changes = newCoinData.reduce((acc, newCoin) => {
            const oldCoin = prevCoins.find(c => c.id === newCoin.id);
            if (oldCoin) {
              if (newCoin.price > oldCoin.price) acc[newCoin.id] = 'up';
              else if (newCoin.price < oldCoin.price) acc[newCoin.id] = 'down';
            }
            return acc;
          }, {} as Record<string, 'up' | 'down'>);
          
          setPriceChanges(changes);
          setTimeout(() => setPriceChanges({}), 1500); // Clear changes after animation
        }
        return newCoinData;
      });
      setLastUpdated(new Date());

      // Update selectedCoin state with fresh data from the new list
      if (selectedCoin) {
        const updatedCoin = newCoinData.find(c => c.id === selectedCoin.id);
        if (updatedCoin) {
            setSelectedCoin(updatedCoin);
        }
      }
    }

    if (isManual) {
      setIsRefreshing(false);
    }
    if (isLoadingCoins) {
        setIsLoadingCoins(false);
    }
  }, [isRefreshing, isLoadingCoins, selectedCoin]);

  useEffect(() => {
    handleRefresh(true); // Initial load
    const intervalId = setInterval(() => handleRefresh(false), 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect to set initial selected coin
  useEffect(() => {
    if (coins.length > 0 && !selectedCoin) {
      setSelectedCoin(coins[0]);
    }
  }, [coins, selectedCoin]);

  // Effect to load details when selectedCoin changes
  useEffect(() => {
    const loadCoinDetails = async () => {
      if (selectedCoin) {
        setIsLoadingChart(true);
        setIsLoadingSentiment(true);
        setIsLoadingForecast(true);
        setChartData([]);
        setSentimentData(null);
        setForecastData(null);

        const [historicalData, sentiment, forecast] = await Promise.all([
          fetchHistoricalData(selectedCoin.name),
          fetchCoinNewsAndSentiment(selectedCoin.name),
          fetchPriceForecast(selectedCoin.name)
        ]);
        
        setChartData(historicalData);
        setSentimentData(sentiment);
        setForecastData(forecast);

        setIsLoadingChart(false);
        setIsLoadingSentiment(false);
        setIsLoadingForecast(false);
      }
    };
    loadCoinDetails();
  }, [selectedCoin?.id]); // Depend only on the ID


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header 
        onRefresh={() => handleRefresh(true)} 
        isRefreshing={isRefreshing} 
        lastUpdated={lastUpdated} 
        onToggleChat={() => setIsChatOpen(prev => !prev)}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        <Dashboard 
            // Coin list props
            coins={coins} 
            isLoadingCoins={isLoadingCoins} 
            priceChanges={priceChanges}
            selectedCoinId={selectedCoin?.id}
            onCoinSelect={setSelectedCoin}
            // Coin detail props
            selectedCoin={selectedCoin}
            chartData={chartData}
            isLoadingChart={isLoadingChart}
            sentimentData={sentimentData}
            isLoadingSentiment={isLoadingSentiment}
            forecastData={forecastData}
            isLoadingForecast={isLoadingForecast}
        />
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Crypto data is generated by AI for demonstration purposes.</p>
      </footer>
      <ChatAssistant 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        selectedCoin={selectedCoin}
      />
    </div>
  );
};

export default App;