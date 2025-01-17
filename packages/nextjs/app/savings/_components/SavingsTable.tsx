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
          <tr className="grid place-items-center rounded-sm bg-gray-2 dark:bg-meta-4 grid-cols-7">
            <td className="p-2.5 xl:p-5">
              <h5 className="text-xs md:text-sm xl:text-base font-bold ">Ahorro</h5>
            </td>
            <td className="p-2.5 text-center xl:p-5">
              <h5 className="text-xs md:text-sm xl:text-base font-bold ">Hash</h5>
            </td>
            <td className="p-2.5 text-center xl:p-5">
              <h5 className="text-xs md:text-sm xl:text-base font-bold ">Fecha</h5>
            </td>
            <td className="p-2.5 text-center xl:p-5">
              <h5 className="text-[9px] md:text-sm xl:text-base font-bold ">Primer pago PYT</h5>
            </td>
            <td className="p-2.5 text-center xl:p-5">
              <h5 className="text-[9px] md:text-sm xl:text-base font-bold ">Segundo pago PYT</h5>
            </td>
            <td className="p-2.5 text-center xl:p-5">
              <h5 className="text-[9px] md:text-sm xl:text-base font-bold ">Tercer pago PYT</h5>
            </td>
            <td className="p-1 pt-2.5 text-center xl:p-5">
              <h5 className="text-[9px] md:text-sm xl:text-base font-bold ">Pago de beneficios</h5>
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
                pyt={tx.pyt}
                commissions={tx.commissions}
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
