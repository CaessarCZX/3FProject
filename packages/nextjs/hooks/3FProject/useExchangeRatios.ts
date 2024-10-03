import { useCallback, useEffect, useState } from "react";
import axios from "axios";

interface ExchangeRates {
  USDT?: string;
  [key: string]: string | undefined;
}
const getCoinbaseApi = process.env.NEXT_PUBLIC_API_EXCHANGE_RATES_ETH;

export const useExchangeRatios = (coin: string) => {
  const [exchangeRatio, setExchangeRatio] = useState<ExchangeRates>({});
  const [loadingData, setLoadingData] = useState(true);

  const getExchangeRates = useCallback(async () => {
    if (!getCoinbaseApi) {
      console.error("API endpoint not defined");
      setLoadingData(false);
      return;
    }

    try {
      setLoadingData(true);
      const response = await axios.get(`${getCoinbaseApi}`, {
        params: { currency: coin },
      });
      setExchangeRatio(response.data.data.rates);
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    } finally {
      setLoadingData(false);
    }
  }, [coin]);

  useEffect(() => {
    getExchangeRates();
  }, [getExchangeRates]);

  return {
    exchangeRatio,
    loadingData,
  };
};
