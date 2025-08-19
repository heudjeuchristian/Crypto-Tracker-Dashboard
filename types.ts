export interface Coin {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
}

export interface ChartDataPoint {
  date: string;
  price: number;
}

export interface NewsArticle {
  headline: string;
  source: string;
}

export interface SentimentData {
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  summary: string;
  news: NewsArticle[];
}

export interface PriceForecastData {
  summary: string;
  support: number;
  resistance: number;
  confidence: number; // A percentage from 0 to 100
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}