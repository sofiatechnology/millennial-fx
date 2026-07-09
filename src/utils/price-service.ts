// utils/price-service.ts
import axios from 'axios';

// Hardcoded fallback prices for when API fails
const FALLBACK_PRICES: Record<string, number> = {
  'XAU/USD': 2030.50,
  'XAG/USD': 24.30,
  'XRP/UST': 0.62,
  'BTC/USD': 65000,
  'ETH/USD': 3500,
  'EUR/USD': 1.0850,
  'GBP/USD': 1.2750,
  'USD/JPY': 148.50,
  'USD/CHF': 0.8820,
  'AUD/USD': 0.6570,
  'USD/CAD': 1.3480,
  'NZD/USD': 0.6120,
  'EUR/GBP': 0.8510,
  'EUR/JPY': 161.00,
  'GBP/JPY': 189.50,
};

export interface PriceData {
  pair: string;
  price: number;
  timestamp: number;
  isFallback: boolean;
}

export class PriceService {
  private static instance: PriceService;
  private cache: Map<string, { data: PriceData; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30000; // 30 seconds

  static getInstance(): PriceService {
    if (!PriceService.instance) {
      PriceService.instance = new PriceService();
    }
    return PriceService.instance;
  }

  async getPrice(pair: string): Promise<PriceData> {
    // Check cache first
    const cached = this.cache.get(pair);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      // Try to fetch from API
      const cleanPair = pair.replace('/', '');
      const base = pair.split('/')[0];
      const quote = pair.split('/')[1];

      const response = await axios.get('https://api.exchangerate.host/convert', {
        params: {
          from: base,
          to: quote,
          amount: 1,
        },
        timeout: 5000, // 5 second timeout
      });

      const price = response.data.result;
      const data: PriceData = {
        pair,
        price,
        timestamp: Date.now(),
        isFallback: false,
      };

      // Cache the result
      this.cache.set(pair, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.warn(`Failed to fetch price for ${pair}, using fallback:`, error);
      // Use fallback price
      const fallbackPrice = FALLBACK_PRICES[pair] || 1.0000;
      const data: PriceData = {
        pair,
        price: fallbackPrice,
        timestamp: Date.now(),
        isFallback: true,
      };
      
      this.cache.set(pair, { data, timestamp: Date.now() });
      return data;
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const priceService = PriceService.getInstance();