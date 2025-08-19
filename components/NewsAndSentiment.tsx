import React from 'react';
import type { SentimentData } from '../types';
import LoadingSpinner from './LoadingSpinner';
import SentimentIndicator from './SentimentIndicator';

interface NewsAndSentimentProps {
  data: SentimentData | null;
  isLoading: boolean;
}

const NewsAndSentiment: React.FC<NewsAndSentimentProps> = ({ data, isLoading }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg shadow-lg p-4 sm:p-6 flex flex-col backdrop-blur-md border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-gray-200">AI News & Sentiment Analysis</h2>
      
      {isLoading && (
        <div className="flex-grow flex justify-center items-center min-h-[200px]">
          <LoadingSpinner />
          <p className="ml-4 text-lg">Analyzing Sentiment...</p>
        </div>
      )}

      {!isLoading && data && (
        <div>
          <SentimentIndicator sentiment={data.sentiment} />
          <p className="text-gray-300 mt-3 mb-5">{data.summary}</p>
          <h3 className="font-semibold text-gray-300 border-b border-gray-600 pb-2 mb-3">Recent Headlines</h3>
          <ul className="space-y-3">
            {data.news.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-cyan-400 mr-3 mt-1">&#9679;</span>
                <div>
                  <p className="text-gray-100">{item.headline}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.source}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!isLoading && !data && (
        <div className="flex-grow flex justify-center items-center min-h-[200px]">
          <p className="text-gray-500">Could not load sentiment data.</p>
        </div>
      )}
    </div>
  );
};

export default NewsAndSentiment;
