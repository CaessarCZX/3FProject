import { useGlobalState } from "~~/services/store/store";

export const useMexicanPesoPrice = () => {
  const mexicanPesoPrice = useGlobalState(state => state.mexicanPeso.price);
  const isMexicanPesoPriceFetching = useGlobalState(state => state.mexicanPeso.isFetching);
  return { mexicanPeso: mexicanPesoPrice, isLoading: isMexicanPesoPriceFetching };
};
