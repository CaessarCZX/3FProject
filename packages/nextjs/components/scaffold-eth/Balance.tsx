"use client";

import { useEffect, useState } from "react";
import { Address, formatEther } from "viem";
import { useDisplayPreferredCurrencies } from "~~/hooks/3FProject/useDisplayPreferredCurrencies";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useWatchBalance } from "~~/hooks/scaffold-eth/useWatchBalance";
import { useGlobalState } from "~~/services/store/store";
import {
  displayCurrencyConvertion,
  formatCurrency,
  parseCurrency,
  parseThreeDecimals,
} from "~~/utils/3FContract/currencyConvertion";

type BalanceProps = {
  address?: Address;
  className?: string;
  currenciesMode?: boolean;
};

/**
 * Display (ETH & USD/ ETH to MXN) balance of an ETH address.
 */
export const Balance = ({ address, className = "", currenciesMode }: BalanceProps) => {
  const { targetNetwork } = useTargetNetwork();
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
  const isNativeCurrencyPriceFetching = useGlobalState(state => state.nativeCurrency.isFetching);
  const mexicanPesoPrice = useGlobalState(state => state.mexicanPeso.price);
  const isMexicanPesoPriceFetching = useGlobalState(state => state.mexicanPeso.isFetching);
  const [currentDollarBalance, setCurrentDollarBalance] = useState<number>(0);

  const {
    data: balance,
    isError,
    isLoading,
  } = useWatchBalance({
    address,
  });

  const { displayCurrenciesMode, toggleDisplayCurrenciesMode } = useDisplayPreferredCurrencies({
    defaultDisplayMode: currenciesMode,
  });
  const currentEtherBalance = balance ? Number(formatEther(balance.value)) : 0;

  useEffect(() => {
    if (!isNativeCurrencyPriceFetching && nativeCurrencyPrice != 0) {
      const dolarBalance = parseThreeDecimals(parseCurrency(currentEtherBalance, nativeCurrencyPrice));
      setCurrentDollarBalance(dolarBalance);
    }
  }, [isNativeCurrencyPriceFetching, nativeCurrencyPrice, currentEtherBalance]);

  if (
    !address ||
    isLoading ||
    balance === null ||
    (isNativeCurrencyPriceFetching && nativeCurrencyPrice === 0) ||
    (isMexicanPesoPriceFetching && mexicanPesoPrice === 0)
  ) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`border-2 border-gray-400 rounded-md px-2 flex flex-col items-center max-w-fit cursor-pointer`}>
        <div className="text-warning">Error</div>
      </div>
    );
  }

  return (
    <button
      className={`btn btn-sm btn-ghost flex flex-col font-normal items-center hover:bg-transparent ${className}`}
      onClick={toggleDisplayCurrenciesMode}
    >
      <div className="w-full flex items-center justify-center">
        {displayCurrenciesMode ? (
          <>
            <article className="flex gap-4">
              <div>
                <span className="text-[0.8em] font-bold mr-1"> USD</span>
                <span>{formatCurrency(currentDollarBalance)}</span>
              </div>
              <div>
                <span className="text-[0.8em] font-bold mr-1">MXN</span>
                <span>
                  {displayCurrencyConvertion({ longCurrenci: currentDollarBalance, exchangeRatio: mexicanPesoPrice })}
                </span>
              </div>
            </article>
          </>
        ) : (
          <>
            <span>{currentEtherBalance.toFixed(4)}</span>
            <span className="text-[0.8em] font-bold ml-1">{targetNetwork.nativeCurrency.symbol}</span>
          </>
        )}
      </div>
    </button>
  );
};
