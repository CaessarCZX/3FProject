import { useEffect, useState } from "react";
import axios from "axios";

interface ExchangeRates {
  USDT?: string; // Puede que USDT no esté siempre disponible
  [key: string]: string | undefined; // Permite otras monedas, como USD, EUR, etc.
}

export const useExchangeRatios = (coin: string) => {
  const [exchangeRatio, setExchangeRatio] = useState<ExchangeRates>({});
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const getExchangeRates = async () => {
      try {
        const response = await axios.get("https://api.coinbase.com/v2/exchange-rates", {
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
  }, [coin]);

  return {
    exchangeRatio,
    loadingData,
  };
};
