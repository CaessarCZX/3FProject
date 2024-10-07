import create from "zustand";
import scaffoldConfig from "~~/scaffold.config";
import { ChainWithAttributes } from "~~/utils/scaffold-eth";

/**
 * Zustand Store
 *
 * You can add global state to the app using this useGlobalState, to get & set
 * values from anywhere in the app.
 *
 * Think about it as a global useState.
 */

type GlobalState = {
  nativeCurrency: {
    price: number;
    isFetching: boolean;
  };
  mexicanPeso: {
    price: number;
    isFetching: boolean;
  };
  targetNetwork: ChainWithAttributes;
};

type GlobalActions = {
  setNativeCurrencyPrice: (newNativeCurrencyPriceState: number) => void;
  setIsNativeCurrencyFetching: (newIsNativeCurrencyFetching: boolean) => void;
  setMexicanPesoPrice: (newMexicanPesoPriceState: number) => void;
  setIsMexicanPesoFetching: (newIsMexicanPesoFetching: boolean) => void;
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => void;
};

type GlobalStorage = GlobalState & GlobalActions;

export const useGlobalState = create<GlobalStorage>(set => ({
  nativeCurrency: {
    price: 0,
    isFetching: true,
  },
  setNativeCurrencyPrice: (newValue: number): void =>
    set(state => ({ nativeCurrency: { ...state.nativeCurrency, price: newValue } })),
  setIsNativeCurrencyFetching: (newValue: boolean): void =>
    set(state => ({ nativeCurrency: { ...state.nativeCurrency, isFetching: newValue } })),
  mexicanPeso: {
    price: 0,
    isFetching: true,
  },
  setMexicanPesoPrice: (newValue: number): void =>
    set(state => ({ mexicanPeso: { ...state.mexicanPeso, price: newValue } })),
  setIsMexicanPesoFetching: (newValue: boolean): void =>
    set(state => ({ mexicanPeso: { ...state.mexicanPeso, isFetching: newValue } })),
  targetNetwork: scaffoldConfig.targetNetworks[0],
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => set(() => ({ targetNetwork: newTargetNetwork })),
}));
