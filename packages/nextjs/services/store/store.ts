import create from "zustand";
import { persist } from "zustand/middleware";
import scaffoldConfig from "~~/scaffold.config";
import { MemberTransaction } from "~~/utils/3FContract/block";
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
  memberTransactions: {
    transactions: MemberTransaction[];
    isFetching: boolean;
  };
  memberStatus: {
    active: boolean;
    isFetching: boolean;
  };
};

type GlobalActions = {
  setNativeCurrencyPrice: (newNativeCurrencyPriceState: number) => void;
  setIsNativeCurrencyFetching: (newIsNativeCurrencyFetching: boolean) => void;
  setMexicanPesoPrice: (newMexicanPesoPriceState: number) => void;
  setIsMexicanPesoFetching: (newIsMexicanPesoFetching: boolean) => void;
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => void;
  setMemberTransactions: (newMemberTransactions: MemberTransaction[]) => void;
  setIsMemberTransactionsFetching: (newIsMemberTransactionsFetching: boolean) => void;
  setIsActiveMemberStatus: (newCurrentMemberStatus: boolean) => void;
  setIsMemberStatusFetching: (newIsMemeberStatusFetching: boolean) => void;
};

type GlobalStorage = GlobalState & GlobalActions;

// export const useGlobalState = create<GlobalStorage>(set => ({
//   nativeCurrency: {
//     price: 0,
//     isFetching: true,
//   },
//   setNativeCurrencyPrice: (newValue: number): void =>
//     set(state => ({ nativeCurrency: { ...state.nativeCurrency, price: newValue } })),
//   setIsNativeCurrencyFetching: (newValue: boolean): void =>
//     set(state => ({ nativeCurrency: { ...state.nativeCurrency, isFetching: newValue } })),
//   mexicanPeso: {
//     price: 0,
//     isFetching: true,
//   },
//   setMexicanPesoPrice: (newValue: number): void =>
//     set(state => ({ mexicanPeso: { ...state.mexicanPeso, price: newValue } })),
//   setIsMexicanPesoFetching: (newValue: boolean): void =>
//     set(state => ({ mexicanPeso: { ...state.mexicanPeso, isFetching: newValue } })),
//   targetNetwork: scaffoldConfig.targetNetworks[0],
//   setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => set(() => ({ targetNetwork: newTargetNetwork })),
//   memberTransactions: {
//     transactions: [],
//     isFetching: true,
//   },
//   setMemberTransactions: (newValue: MemberTransaction[]): void =>
//     set(state => ({ memberTransactions: { ...state.memberTransactions, transactions: newValue } })),
//   setIsMemberTransactionsFetching: (newValue: boolean): void =>
//     set(state => ({ memberTransactions: { ...state.memberTransactions, isFetching: newValue } })),
//   memberStatus: {
//     active: false,
//     isFetching: true,
//   },
//   setIsActiveMemberStatus: (newValue: boolean): void =>
//     set(state => ({ memberStatus: { ...state.memberStatus, active: newValue } })),
//   setIsMemberStatusFetching: (newValue: boolean): void =>
//     set(state => ({ memberStatus: { ...state.memberStatus, isFetching: newValue } })),
// }));

export const useGlobalState = create<GlobalStorage>()(
  persist(
    set => ({
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

      memberTransactions: {
        transactions: [],
        isFetching: true,
      },
      setMemberTransactions: (newValue: MemberTransaction[]): void =>
        set(state => ({ memberTransactions: { ...state.memberTransactions, transactions: newValue } })),
      setIsMemberTransactionsFetching: (newValue: boolean): void =>
        set(state => ({ memberTransactions: { ...state.memberTransactions, isFetching: newValue } })),

      memberStatus: {
        active: false,
        isFetching: true,
      },
      setIsActiveMemberStatus: (newValue: boolean): void =>
        set(state => ({ memberStatus: { ...state.memberStatus, active: newValue } })),
      setIsMemberStatusFetching: (newValue: boolean): void =>
        set(state => ({ memberStatus: { ...state.memberStatus, isFetching: newValue } })),
    }),
    {
      name: "global-storage", // nombre único para localStorage
      partialize: state => ({
        nativeCurrency: state.nativeCurrency,
        mexicanPeso: state.mexicanPeso,
        targetNetwork: state.targetNetwork,
        memberTransactions: state.memberTransactions,
        memberStatus: state.memberStatus,
      }),
    },
  ),
);
