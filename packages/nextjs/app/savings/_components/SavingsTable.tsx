import React from "react";
import { SavingsTableRow } from "./SavingsTableRow";
import { MemberSaving } from "~~/types/transaction/saving";

type SavingsTableProps = {
  transactions: MemberSaving[];
};

const SavingsTable: React.FC<SavingsTableProps> = ({ transactions }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-3xl font-light text-gray-500 dark:text-white">Historial</h4>

      <table className="flex flex-col">
        <thead>
          <tr className="grid rounded-sm bg-gray-2 dark:bg-meta-4 grid-cols-7">
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
              <h5 className="text-xs font-medium xsm:text-base">Bono primer trimestre</h5>
            </td>
            <td className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-xs font-medium xsm:text-base">Bono segundo trimestre</h5>
            </td>
            <td className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-xs font-medium xsm:text-base">Bono tercer trimestre</h5>
            </td>
            <td className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium xsm:text-base">Bono residual</h5>
            </td>
          </tr>
        </thead>

        <tbody>
          {transactions.map((tx, key) => {
            // const value = formatUnits(BigInt(tx.value), 6);
            return (
              <SavingsTableRow
                key={tx._id}
                index={key}
                hash={tx.hash}
                value={tx.amount}
                date={tx.date}
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

export default SavingsTable;
