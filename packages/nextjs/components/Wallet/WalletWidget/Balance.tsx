"use client";

import { useEffect, useState } from "react";
import { Address, formatUnits } from "viem";
import { useDisplayPreferredCurrencies } from "~~/hooks/3FProject/useDisplayPreferredCurrencies";
import { useWatchBalance } from "~~/hooks/scaffold-eth/useWatchBalance";
import { useMexicanPesoPrice } from "~~/hooks/token/useMexicanPesoPrice";
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
  const { mexicanPeso, isLoading: isFetching } = useMexicanPesoPrice();
  const [currentUsdtBalance, setCurrentUsdtBalance] = useState(0);
  const [logngAmount, setLongAmount] = useState(false);

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
      const lengthBalance = balance?.value.toString().length ?? 0;
      if (lengthBalance > 10) setLongAmount(true);
      setCurrentUsdtBalance(dolarBalance);
    }
  }, [isLoading, isError, balance]);

  // If not available skeletons displays
  if (!address || isLoading || balance === null || (isFetching && mexicanPeso === 0)) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-6 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  // For network errors
  if (isError) {
    return (
      <div className="border-2 w-full border-gray-400 rounded-md px-2 flex flex-col items-center cursor-pointer">
        <div className="text-warning group-hover:text-red-200">Error no disponible</div>
      </div>
    );
  }

  // Common Render
  return (
    <button
      className={`btn btn-sm btn-ghost flex flex-col font-normal items-center hover:bg-transparent p-0 ${className}`}
      onClick={() => {
        toggleDisplayCurrenciesMode();
      }}
    >
      <div className="w-full flex items-center justify-center gap-2">
        {displayCurrenciesMode ? (
          <>
            <span className={`font-light text-whiten ${logngAmount ? "text-sm" : "text-xl tracking-widest"}`}>
              {displayCurrencyConvertion({ longCurrenci: currentUsdtBalance, exchangeRatio: mexicanPeso })}
            </span>
            <span className={logngAmount ? "text-sm font-bold" : "text-xl font-bold"}>MXN</span>
          </>
        ) : (
          <>
            <span className={`font-light text-whiten ${logngAmount ? "text-sm" : "text-2xl tracking-widest"}`}>
              {formatCurrency(currentUsdtBalance)}
            </span>
            <span className={logngAmount ? "text-sm font-bold" : "text-xl font-bold"}>USDT</span>
          </>
        )}
      </div>
    </button>
  );
};
