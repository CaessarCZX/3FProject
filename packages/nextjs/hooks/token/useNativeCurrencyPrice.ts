import { useGlobalState } from "~~/services/store/store";

export const useNativeCurrenciePrice = () => {
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
  const isNativeCurrencyPriceFetching = useGlobalState(state => state.nativeCurrency.isFetching);
  return { nativeCurrency: nativeCurrencyPrice, isLoading: isNativeCurrencyPriceFetching };
};
