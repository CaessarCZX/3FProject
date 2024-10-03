import { TransactionHash } from "./TransactionHash";
import { formatEther } from "viem";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { TransactionsTableProps } from "~~/utils/3FContract/block";

// import { TransactionWithFunction } from "~~/utils/scaffold-eth";

export const TransactionsTable = ({ transactions, transactionReceipts }: TransactionsTableProps) => {
  const { targetNetwork } = useTargetNetwork();

  return (
    <div className="flex justify-center max-h-56 overflow-y-auto">
      <div className="overflow-x-auto w-full shadow-2xl rounded-xl">
        <table className="table text-xl bg-base-100 table-zebra w-full md:table-md table-sm">
          <thead>
            <tr className="rounded-xl text-sm text-base-content">
              <th className="bg-primary">Hash</th>
              <th className="bg-primary">Fecha</th>
              <th className="bg-primary">Ahorro</th>
              <th className="bg-primary">Estatus</th>
              <th className="bg-primary text-end">Valor ({targetNetwork.nativeCurrency.symbol})</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => {
              const hash = tx.hash;
              const status = transactionReceipts[hash].status;
              const value = tx.value;
              return (
                <tr key={hash} className="hover text-sm">
                  <td className="w-1/12 md:py-4">
                    <TransactionHash hash={hash} />
                  </td>
                  <td className="w-2/1 md:py-4">Date to be confirmed...</td>
                  <td className="w-2/12 md:py-4">Save tipe to be confirmed...</td>
                  <td className="w-2/12 md:py-4">{status}</td>
                  <td className="text-right md:py-4">
                    {formatEther(value)} {targetNetwork.nativeCurrency.symbol}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
