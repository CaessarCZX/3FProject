// import { useEffect, useState } from "react";
import { TransactionsTableRow } from "./TransactionsTableRow";
import { formatUnits } from "viem";
import { getDateAndTimeFromTimestamp } from "~~/utils/3FContract/timestampFormatter";

interface Transaction {
  hash: string;
  value: string;
  timestamp: string;
  status: string;
}

type TransactionTableProps = {
  transactions: Transaction[] | null;
};

export const TransactionsTable = ({ transactions }: TransactionTableProps) => {
  // Function disabled for req
  // const [totalSavings, setTotalSavings] = useState<string[]>();

  // useEffect(() => {
  //   if (!transactions) return;
  //   const createSavings = Array.from({ length: transactions.length }, (_, i) => `Ahorro-${i + 1}`);
  //   setTotalSavings(createSavings);
  // }, [transactions]);

  if (!transactions) {
    return (
      <>
        <p className="font-black text-2xl">No desponible</p>
      </>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-3xl font-light text-black dark:text-white">Ahorros</h4>

      <table className="flex flex-col">
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

        {transactions.map((tx, key) => {
          const hash = tx.hash;
          const { date, time } = getDateAndTimeFromTimestamp(tx.timestamp);
          const value = formatUnits(BigInt(tx.value), 6);
          return (
            <TransactionsTableRow
              key={+hash * key}
              hash={hash}
              value={value}
              date={date}
              time={time}
              status=""
              lengthData={transactions.length}
            />
          );
        })}
      </table>
    </div>
  );
};
