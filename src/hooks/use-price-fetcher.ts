// hooks/usePriceFetcher.ts
import { priceService } from "@/utils/price-service";
import { useEffect, useState } from "react";

interface PriceState {
  price: number | null;
  isLoading: boolean;
  lastUpdated: string;
  isFallback: boolean;
  error: string | null;
}

export function usePriceFetcher(currencyPair: string) {
  const [state, setState] = useState<PriceState>({
    price: null,
    isLoading: false,
    lastUpdated: "",
    isFallback: false,
    error: null,
  });

  useEffect(() => {
    const fetchPrice = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const result = await priceService.getPrice(currencyPair);
        setState({
          price: result.price,
          isLoading: false,
          lastUpdated: new Date().toLocaleTimeString(),
          isFallback: result.isFallback || false,
          error: null,
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: "Failed to fetch price",
        }));
      }
    };

    fetchPrice();
    const intervalId = setInterval(fetchPrice, 30000);
    return () => clearInterval(intervalId);
  }, [currencyPair]);

  return state;
}