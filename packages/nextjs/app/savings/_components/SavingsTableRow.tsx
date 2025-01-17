import React from "react";
import { TransactionHash } from "~~/components/Display/TransactionHash";
import { Commissions, PYT } from "~~/types/transaction/saving";
import { formatCurrency } from "~~/utils/3FContract/currencyConvertion";

type TransactionTableRowProps = {
  index: number;
  hash: string;
  value: string;
  date: string;
  pyt: PYT[];
  commissions: Commissions;
  status: string;
  lengthData: number;
};

export const SavingsTableRow = ({
  hash,
  value,
  date,
  pyt,
  commissions,
  lengthData,
  index,
}: TransactionTableRowProps) => {
  // Función para calcular los días restantes hasta cumplir el trimestre
  // const getTrimestreDaysLeft = (date: string, targetMonths: number) => {
  //   const transactionDate = new Date(date);
  //   const targetDate = new Date(
  //     transactionDate.getFullYear(),
  //     transactionDate.getMonth() + targetMonths,
  //     transactionDate.getDate(),
  //   );

  //   const currentDate = new Date();

  //   if (currentDate >= targetDate) return "Cumplido";

  //   const diffInMilliseconds = targetDate.getTime() - currentDate.getTime();
  //   const daysLeft = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));

  //   return `${daysLeft} días restantes`;
  // };
  function getRemainingDays(targetDate: string) {
    // Crear copia de la fecha actual
    const currentDate = new Date();

    // Resetear las horas, minutos y segundos para comparar solo días
    currentDate.setHours(0, 0, 0, 0);

    // Crear copia de la fecha objetivo y resetear tiempo
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);

    // Calcular la diferencia en milisegundos
    const diffTime = target.getTime() - currentDate.getTime();

    // Convertir a días
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return `${diffDays} días restantes`;
  }

  return (
    <tr
      className={`grid grid-cols-7 ${index === lengthData - 1 ? "" : "border-b border-stroke dark:border-strokedark"}`}
    >
      <td className="flex items-center gap-3 p-2.5 xl:p-5">
        <p className="text-[9px] sm:text-sm xl:text-base font-light text-black dark:text-white">
          {formatCurrency(Number(value))} <span className="font-black text-[9px]">USDT</span>
        </p>
      </td>

      <td className="text-[9px] sm:text-sm xl:text-base flex items-center justify-center p-2.5 xl:p-5">
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
        <p className="text-[9px] sm:text-sm xl:text-base flex text-meta-3 dark:text-green-500 my-2">
          {new Date(date).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
      </td>

      <td className="text-[9px] sm:text-sm xl:text-base flex items-center justify-center font-medium p-2.5 xl:p-5">
        <p className="text-gray-700 dark:text-gray-400 my-2">{getRemainingDays(pyt[0].paymentDay)}</p>
      </td>

      <td className="text-[9px] sm:text-sm xl:text-base flex items-center justify-center font-medium p-2.5 xl:p-5">
        <p className="text-gray-700 dark:text-gray-400 my-2">{getRemainingDays(pyt[1].paymentDay)}</p>
      </td>

      <td className="text-[9px] sm:text-sm xl:text-base flex items-center justify-center font-medium p-2.5 xl:p-5">
        <p className="text-gray-700 dark:text-gray-400 my-2">{getRemainingDays(pyt[2].paymentDay)}</p>
      </td>

      <td className="text-[9px] sm:text-sm xl:text-base flex items-center justify-center font-medium p-2.5 xl:p-5">
        <p className="text-meta-7 dark:text-red-700 my-2">{getRemainingDays(commissions.paymentDay)}</p>
      </td>
    </tr>
  );
};
