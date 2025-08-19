import { GoogleGenAI, Type } from "@google/genai";
import type { Coin, ChartDataPoint, SentimentData, PriceForecastData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const coinListSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "Unique identifier, e.g., 'bitcoin'" },
      rank: { type: Type.INTEGER, description: "Cryptocurrency rank by market cap" },
      name: { type: Type.STRING, description: "Full name, e.g., 'Bitcoin'" },
      symbol: { type: Type.STRING, description: "Ticker symbol, e.g., 'BTC'" },
      price: { type: Type.NUMBER, description: "Current price in USD" },
      priceChange24h: { type: Type.NUMBER, description: "Percentage change in the last 24 hours" },
      marketCap: { type: Type.NUMBER, description: "Total market capitalization in USD" },
    },
    required: ["id", "rank", "name", "symbol", "price", "priceChange24h", "marketCap"],
  },
};

const historicalDataSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      date: { type: Type.STRING, description: "Date in 'YYYY-MM-DD' format" },
      price: { type: Type.NUMBER, description: "Price in USD on that date" },
    },
    required: ["date", "price"],
  }
};

const newsAndSentimentSchema = {
    type: Type.OBJECT,
    properties: {
        sentiment: { 
            type: Type.STRING, 
            description: "Overall market sentiment for the coin. Must be one of: 'Bullish', 'Bearish', 'Neutral'." 
        },
        summary: { 
            type: Type.STRING, 
            description: "A 2-3 sentence summary explaining the current sentiment based on the news." 
        },
        news: {
            type: Type.ARRAY,
            description: "A list of 3 recent news articles.",
            items: {
                type: Type.OBJECT,
                properties: {
                    headline: { type: Type.STRING, description: "The news headline." },
                    source: { type: Type.STRING, description: "A plausible-sounding news source, e.g., 'Crypto Daily'." },
                },
                required: ["headline", "source"],
            }
        }
    },
    required: ["sentiment", "summary", "news"],
};

const priceForecastSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: "A 2-3 sentence summary of the short-term price forecast." },
        support: { type: Type.NUMBER, description: "A key support price level in USD." },
        resistance: { type: Type.NUMBER, description: "A key resistance price level in USD." },
        confidence: { type: Type.INTEGER, description: "A confidence score for this forecast, from 0 to 100." },
    },
    required: ["summary", "support", "resistance", "confidence"],
};


export const fetchCoinData = async (): Promise<Coin[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a list of the top 15 cryptocurrencies with their current, realistic-looking price, 24-hour price change percentage, and market cap. Include Bitcoin, Ethereum, Solana, Ripple, and Dogecoin.",
      config: {
        responseMimeType: "application/json",
        responseSchema: coinListSchema,
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);
    return data as Coin[];
  } catch (error) {
    console.error("Error fetching coin data:", error);
    return [];
  }
};

export const fetchHistoricalData = async (coinName: string): Promise<ChartDataPoint[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate realistic historical daily price data for ${coinName} for the last 90 days. The data points should show a believable trend with ups and downs.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: historicalDataSchema,
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);
    
    // Sort data just in case API returns it unordered
    return (data as ChartDataPoint[]).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.error(`Error fetching historical data for ${coinName}:`, error);
    return [];
  }
};

export const fetchCoinNewsAndSentiment = async (coinName: string): Promise<SentimentData | null> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on simulated recent events, generate a market sentiment analysis for ${coinName}. Provide an overall sentiment, a brief summary, and 3 realistic-sounding news headlines.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: newsAndSentimentSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as SentimentData;
    } catch (error) {
        console.error(`Error fetching news and sentiment for ${coinName}:`, error);
        return null;
    }
};

export const fetchPriceForecast = async (coinName: string): Promise<PriceForecastData | null> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a short-term (1-3 day) price forecast for ${coinName}. Provide a summary, a likely support level, a likely resistance level, and a confidence score percentage.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: priceForecastSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as PriceForecastData;
    } catch (error) {
        console.error(`Error fetching price forecast for ${coinName}:`, error);
        return null;
    }
};
