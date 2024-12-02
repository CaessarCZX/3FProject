import React from "react";
import { TransactionHash } from "~~/components/Display/TransactionHash";
import { WithdrawalCounter } from "~~/components/Display/WithdrawalCounter";
import { formatCurrency } from "~~/utils/3FContract/currencyConvertion";

type TransactionTableRowProps = {
  key: number;
  hash: string;
  value: string;
  date: string;
  time: string;
  status: string;
  lengthData: number;
};

export const TransactionsTableRow = ({
  hash,
  value,
  date,
  time,
  status,
  lengthData,
  key,
}: TransactionTableRowProps) => {
  return (
    <div
      className={`grid grid-cols-3 sm:grid-cols-5 ${
        key === lengthData - 1 ? "" : "border-b border-stroke dark:border-strokedark"
      }`}
      key={key}
    >
      <div className="flex items-center gap-3 p-2.5 xl:p-5">
        <p className="hidden font-light text-black dark:text-white sm:block">
          {formatCurrency(Number(value))} <span className="font-black text-xs">USDT</span>
        </p>
      </div>

      <div className="flex items-center justify-center p-2.5 xl:p-5">
        <TransactionHash hash={hash} />
      </div>

      <div className="flex items-center justify-center p-2.5 xl:p-5">
        <p className="text-meta-3 dark:text-white">{date}</p>
      </div>

      <div className="hidden items-center font-bold justify-center p-2.5 sm:flex xl:p-5">
        {/* <p className="text-black dark:text-white">{brand.sales}</p> */}
        <WithdrawalCounter date={date} time={time} />
      </div>

      <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
        {/* <p className="text-meta-5">{brand.conversion}%</p> */}
        <p className="text-meta-5">{status}</p>
      </div>
    </div>
  );
};
