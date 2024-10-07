import axios from "axios";

type ExchangeRates = {
  [key: string]: string | undefined;
};

type FetchResponse = {
  exchangeRatio: ExchangeRates;
};

const getCoinbaseApi = process.env.NEXT_PUBLIC_API_EXCHANGE_RATES_ETH;

export const fetchPriceFromCoinbase = async (coin: string): Promise<FetchResponse> => {
  if (!getCoinbaseApi) {
    console.error("API endpoint not defined");
    return {
      exchangeRatio: {},
    };
  }

  try {
    const response = await axios.get(`${getCoinbaseApi}`, {
      params: { currency: coin },
    });
    return {
      exchangeRatio: response.data.data.rates,
    };
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return {
      exchangeRatio: {},
    };
  }
};
