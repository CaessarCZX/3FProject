import { useCallback, useEffect, useState } from "react";
import { useGlobalState } from "~~/services/store/store";

type DisplayPreferredCurrenciesProps = {
  defaultDisplayMode?: boolean;
};

export const useDisplayPreferredCurrencies = ({ defaultDisplayMode = false }: DisplayPreferredCurrenciesProps) => {
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
  const mexicanPesoPrice = useGlobalState(state => state.mexicanPeso.price);
  const isPriceFetched = nativeCurrencyPrice > 0 && mexicanPesoPrice > 0;
  const predefinedDisplayMode = isPriceFetched ? Boolean(defaultDisplayMode) : false;
  const [displayCurrenciesMode, setDisplayCurrenciesMode] = useState(predefinedDisplayMode);

  useEffect(() => {
    setDisplayCurrenciesMode(predefinedDisplayMode);
  }, [predefinedDisplayMode]);

  const toggleDisplayCurrenciesMode = useCallback(() => {
    if (isPriceFetched) {
      setDisplayCurrenciesMode(!displayCurrenciesMode);
    }
  }, [displayCurrenciesMode, isPriceFetched]);

  return { displayCurrenciesMode, toggleDisplayCurrenciesMode };
};
