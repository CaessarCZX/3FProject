// import { useEffect, useState } from "react";
import { TransactionsTableRow } from "./TransactionsTableRow";
import { MemberSaving } from "~~/types/transaction/saving";
import { getDateAndTimeFromTimestamp } from "~~/utils/3FContract/timestampFormatter";

type TransactionTableProps = {
  transactions: MemberSaving[];
};

export const TransactionsTable = ({ transactions }: TransactionTableProps) => {
  if (!transactions) {
    return (
      <>
        <p className="font-black text-2xl">No disponible</p>
      </>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-3xl font-light text-black dark:text-white">Ahorros</h4>

      <table className="flex flex-col">
        <thead>
          <tr className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
            <td className="p-2.5 xl:p-5">
              <h5 className="text-xs font-bold xsm:text-base">Ahorro</h5>
            </td>
            <td className="p-2.5 text-center xl:p-5">
              <h5 className="text-xs font-bold xsm:text-base">Hash</h5>
            </td>
            <td className="p-2.5 text-center xl:p-5">
              <h5 className="text-xs font-bold xsm:text-base">Fecha</h5>
            </td>
            <td className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-xs font-bold xsm:text-base">Proximo pago</h5>
            </td>
            <td className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-bold xsm:text-base">Estatus</h5>
            </td>
          </tr>
        </thead>

        <tbody>
          {transactions.map((tx, key) => {
            const { date, time } = getDateAndTimeFromTimestamp(tx.date);
            // const value = formatUnits(BigInt(tx.value), 6);
            return (
              <TransactionsTableRow
                key={tx._id}
                index={key}
                hash={tx.hash}
                value={tx.amount}
                date={date}
                time={time}
                status={tx.status}
                lengthData={transactions.length}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
