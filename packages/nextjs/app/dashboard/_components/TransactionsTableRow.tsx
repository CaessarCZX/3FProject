import React from "react";
import { TransactionHash } from "~~/components/Display/TransactionHash";
import { WithdrawalCounter } from "~~/components/Display/WithdrawalCounter";
import { formatCurrency } from "~~/utils/3FContract/currencyConvertion";

type TransactionTableRowProps = {
  hash: string;
  value: string;
  date: string;
  time: string;
  savigName: string;
};

export const TransactionsTableRow = ({ hash, value, date, time, savigName }: TransactionTableRowProps) => {
  return (
    <>
      <tr key={hash} className="hover text-sm">
        <td className="text-center text-xs md:py-4">
          {formatCurrency(Number(value))} <span className="font-semibold text-xs">USDT</span>
        </td>
        <td className="w-1/12 md:py-4">
          <TransactionHash hash={hash} />
        </td>
        <td className="w-2/1 md:py-4 text-xs">
          <span className="font-bold">{date}</span>
          <span className="font-light ml-4">{time}</span>
        </td>
        <td className="w-2/1 text-center font-bold md:py-4">
          <WithdrawalCounter date={date} time={time} />
        </td>
        <td className="w-2/12 md:py-4">{savigName}</td>
      </tr>
    </>
  );
};
