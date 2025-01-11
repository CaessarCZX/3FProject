import React from "react";
import { TransactionHash } from "~~/components/Display/TransactionHash";
import { formatCurrency } from "~~/utils/3FContract/currencyConvertion";

type TransactionTableRowProps = {
  index: number;
  hash: string;
  value: string;
  date: string;
  status: string;
  lengthData: number;
};

export const TransactionsTableRow = ({ hash, value, date, status, lengthData, index }: TransactionTableRowProps) => {
  const getTrimestreDaysLeft = (date: string, targetMonths: number) => {
    const transactionDate = new Date(date);
    const targetDate = new Date(
      transactionDate.getFullYear(),
      transactionDate.getMonth() + targetMonths,
      transactionDate.getDate(),
    );

    const currentDate = new Date();

    if (currentDate >= targetDate) return "Cumplido";

    const diffInMilliseconds = targetDate.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));

    return `${daysLeft} días restantes`;
  };

  return (
    <tr
      className={`grid grid-cols-5 ${index === lengthData - 1 ? "" : "border-b border-stroke dark:border-strokedark"}`}
    >
      <td className="flex items-center gap-3 p-2.5 xl:p-5">
        <p className="text-[10px] sm:text-sm xl:text-base font-light text-black dark:text-white my-2">
          {formatCurrency(Number(value))} <span className="font-black text-[9px] sm:text-xs">USDT</span>
        </p>
      </td>

      <td className="text-[10px] sm:text-sm xl:text-base flex items-center justify-center p-2.5 xl:p-5">
        {/* For responsive mobile */}
        <div className="hidden sm:block">
          <TransactionHash hash={hash} />
        </div>
        <div className="sm:hidden">
          <TransactionHash isSmallScreen hash={hash} />
        </div>
        {/* For responsive mobile */}
      </td>

      <td className="flex items-center justify-center p-2.5 xl:p-5">
        <p className="text-[10px] sm:text-sm xl:text-base text-meta-3 dark:text-green-500 my-2">
          {new Date(date).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
      </td>

      <td className="text-[9px] sm:text-sm xl:text-base items-center font-bold justify-center p-2.5 flex xl:p-5">
        {/* <p className="text-black dark:text-white">{brand.sales}</p> */}
        {/* <WithdrawalCounter date={date} time={time} /> */}
        {getTrimestreDaysLeft(date, 3)}
      </td>

      <td className="items-center justify-center p-2.5 flex xl:p-5">
        {/* <p className="text-meta-5">{brand.conversion}%</p> */}
        {/* <p className="text-meta-5">Pendiente</p> */}
        <p className="text-[10px] sm:text-sm text-meta-5 my-2">{status && "Completado"}</p>
      </td>
    </tr>
  );
};
