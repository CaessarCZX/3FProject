import { useEffect, useState } from "react";
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
  const [totalSavings, setTotalSavings] = useState<string[]>();

  useEffect(() => {
    if (!transactions) return;
    const createSavings = Array.from({ length: transactions.length }, (_, i) => `Ahorro-${i + 1}`);
    setTotalSavings(createSavings);
  }, [transactions]);

  if (!transactions) {
    return (
      <>
        <p className="font-black text-2xl">No desponible</p>
      </>
    );
  }

  return (
    <div className="flex justify-center max-h-56 overflow-y-auto">
      <div className="overflow-x-auto w-full shadow-2xl rounded-xl">
        <table className="table text-xl bg-base-100 table-zebra w-full md:table-md table-sm">
          <thead>
            <tr className="rounded-xl text-sm text-base-content">
              <th className="bg-primary">Valor</th>
              <th className="bg-primary">Hash</th>
              <th className="bg-primary">Fecha y hora</th>
              <th className="bg-primary">Tiempo para retiro</th>
              <th className="bg-primary">Ahorro</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => {
              const hash = tx.hash;
              const { date, time } = getDateAndTimeFromTimestamp(tx.timestamp);
              const value = formatUnits(BigInt(tx.value), 6);
              return (
                <TransactionsTableRow
                  key={+hash * i}
                  hash={hash}
                  value={value}
                  date={date}
                  time={time}
                  savigName={totalSavings ? totalSavings[i] : "No disponible"}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
