
import React from 'react';
import type { Coin } from '../types';
import { formatCurrency, formatMarketCap } from '../utils/formatters';
import PriceChange from './PriceChange';

interface CoinListProps {
  coins: Coin[];
  onCoinSelect: (coin: Coin) => void;
  selectedCoinId?: string;
  priceChanges: Record<string, 'up' | 'down'>;
}

const CoinList: React.FC<CoinListProps> = ({ coins, onCoinSelect, selectedCoinId, priceChanges }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg shadow-lg overflow-hidden backdrop-blur-md border border-gray-700">
      <h2 className="text-xl font-bold p-4 border-b border-gray-700">Top Coins</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-700/50 text-xs text-gray-400 uppercase tracking-wider">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Coin</th>
              <th className="p-3 text-right">Price</th>
              <th className="p-3 text-right">24h %</th>
              <th className="p-3 hidden sm:table-cell text-right">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => {
              const changeClass = priceChanges[coin.id] === 'up' 
                ? 'bg-green-500/20' 
                : priceChanges[coin.id] === 'down' 
                ? 'bg-red-500/20' 
                : '';

              return (
              <tr
                key={coin.id}
                onClick={() => onCoinSelect(coin)}
                className={`border-b border-gray-700 cursor-pointer transition-colors duration-1000 ${
                  selectedCoinId === coin.id ? 'bg-cyan-500/10' : 'hover:bg-gray-700/50'
                } ${changeClass}`}
              >
                <td className="p-3 text-gray-400">{coin.rank}</td>
                <td className="p-3">
                  <div className="flex items-center">
                    <div className="font-bold">{coin.name}</div>
                    <div className="text-gray-400 ml-2 text-xs">{coin.symbol.toUpperCase()}</div>
                  </div>
                </td>
                <td className="p-3 text-right font-mono">{formatCurrency(coin.price)}</td>
                <td className="p-3 text-right">
                    <PriceChange change={coin.priceChange24h} />
                </td>
                <td className="p-3 hidden sm:table-cell text-right font-mono text-gray-400">{formatMarketCap(coin.marketCap)}</td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoinList;
