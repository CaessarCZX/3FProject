import { useEffect, useState } from "react";
import axios from "axios";

interface ExchangeRates {
  USDT?: string; // Puede que USDT no esté siempre disponible
  [key: string]: string | undefined; // Permite otras monedas, como USD, EUR, etc.
}

export const useExchangeRatios = (coin: string) => {
  const [exchangeRatio, setExchangeRatio] = useState<ExchangeRates>({});
  const [loadingData, setLoadingData] = useState(true);
  const getCoinbaseApi = process.env.API_EXCHANGE_RATES_ETH;

  useEffect(() => {
    const getExchangeRates = async () => {
      try {
        const response = await axios.get(`${getCoinbaseApi}`, {
          params: { currency: coin },
        });
        setExchangeRatio(response.data.data.rates);
        setLoadingData(false);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
        setLoadingData(false);
      }
    };

    getExchangeRates();
  }, [coin, getCoinbaseApi]);

  return {
    exchangeRatio,
    loadingData,
  };
};
