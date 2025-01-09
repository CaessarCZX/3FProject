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

export const SavingsTableRow = ({ hash, value, date, lengthData, index }: TransactionTableRowProps) => {
  // Función para calcular los días restantes hasta cumplir el trimestre
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
      className={`grid grid-cols-7 ${index === lengthData - 1 ? "" : "border-b border-stroke dark:border-strokedark"}`}
    >
      <td className="flex items-center gap-3 p-2.5 xl:p-5">
        <p className="hidden font-light text-black dark:text-white sm:block">
          {formatCurrency(Number(value))} <span className="font-black text-xs">USDT</span>
        </p>
      </td>

      <td className="flex items-center justify-center p-2.5 xl:p-5">
        <TransactionHash hash={hash} />
      </td>

      <td className="flex items-center justify-center p-2.5 xl:p-5">
        <p className="text-meta-3 dark:text-green-500 text-sm my-2">
          {new Date(date).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
      </td>

      <td className="flex items-center font-medium justify-center p-2.5 xl:p-5">
        <p className="text-gray-700 dark:text-gray-400 text-sm my-2">{getTrimestreDaysLeft(date, 3)}</p>
      </td>

      <td className="hidden items-center font-medium justify-center p-2.5 sm:flex xl:p-5">
        <p className="text-gray-700 dark:text-gray-400 text-sm my-2">{getTrimestreDaysLeft(date, 6)}</p>
      </td>

      <td className="hidden items-center font-medium justify-center p-2.5 sm:flex xl:p-5">
        <p className="text-gray-700 dark:text-gray-400 text-sm my-2">{getTrimestreDaysLeft(date, 9)}</p>
      </td>

      <td className="hidden items-center font-medium justify-center p-2.5 sm:flex xl:p-5">
        <p className="text-meta-7 dark:text-red-700 text-sm my-2">{getTrimestreDaysLeft(date, 10)}</p>
      </td>
    </tr>
  );
};
