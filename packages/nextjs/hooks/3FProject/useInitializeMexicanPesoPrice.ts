import { useCallback, useEffect } from "react";
import { fetchPriceFromCoinbase } from "../../utils/3FContract/fetchPriceFromCoinbase";
import { useInterval } from "usehooks-ts";
import scaffoldConfig from "~~/scaffold.config";
import { useGlobalState } from "~~/services/store/store";

const enablePolling = false;

/**
 * Get the price of Native Currency based on Native Token/DAI trading pair from Uniswap SDK
 */
export const useInitializeMexicanPesoPrice = () => {
  const setMexicanPesoPrice = useGlobalState(state => state.setMexicanPesoPrice);
  const setIsMexicanPesoFetching = useGlobalState(state => state.setIsMexicanPesoFetching);

  const fetchPrice = useCallback(async () => {
    setIsMexicanPesoFetching(true);
    const { exchangeRatio } = await fetchPriceFromCoinbase("USD");
    if (exchangeRatio && exchangeRatio.MXN) setMexicanPesoPrice(Number(exchangeRatio?.MXN));
    setIsMexicanPesoFetching(false);
  }, [setIsMexicanPesoFetching, setMexicanPesoPrice]);

  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  useInterval(fetchPrice, enablePolling ? scaffoldConfig.pollingInterval : null);
};
