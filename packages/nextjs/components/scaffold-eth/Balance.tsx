"use client";

import { useEffect, useState } from "react";
import { Address, formatUnits } from "viem";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { useDisplayPreferredCurrencies } from "~~/hooks/3FProject/useDisplayPreferredCurrencies";
import { useWatchBalance } from "~~/hooks/scaffold-eth/useWatchBalance";
import { useGlobalState } from "~~/services/store/store";
import { displayCurrencyConvertion, formatCurrency } from "~~/utils/3FContract/currencyConvertion";

type BalanceProps = {
  address?: Address;
  className?: string;
  currenciesMode?: boolean;
};

/**
 * Display (ETH & USD/ ETH to MXN) balance of an ETH address.
 */
export const Balance = ({ address, className = "", currenciesMode }: BalanceProps) => {
  const mexicanPesoPrice = useGlobalState(state => state.mexicanPeso.price);
  const isMexicanPesoPriceFetching = useGlobalState(state => state.mexicanPeso.isFetching);
  const [currentUsdtBalance, setCurrentUsdtBalance] = useState(0);

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

  useEffect(() => {
    if (!isLoading && !isError) {
      const dolarBalance = balance ? Number(formatUnits(balance?.value, 6)) : 0;
      setCurrentUsdtBalance(dolarBalance);
    }
  }, [isLoading, isError, balance]);

  if (!address || isLoading || balance === null || (isMexicanPesoPriceFetching && mexicanPesoPrice === 0)) {
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
        <span className="mr-1">
          <BanknotesIcon className="h-4 w-4" />
        </span>
        {displayCurrenciesMode ? (
          <>
            <span className="text-[0.8em] font-bold mr-1">MXN</span>
            <span>
              {displayCurrencyConvertion({ longCurrenci: currentUsdtBalance, exchangeRatio: mexicanPesoPrice })}
            </span>
          </>
        ) : (
          <>
            <span className="text-[0.8em] font-bold mr-1">USDT</span>
            <span>{formatCurrency(currentUsdtBalance)}</span>
          </>
        )}
      </div>
    </button>
  );
};
