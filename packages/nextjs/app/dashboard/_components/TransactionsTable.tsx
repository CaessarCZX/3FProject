import Image from "next/image";
import { TransactionsTableRow } from "./TransactionsTableRow";
import savingD from "~~/public/common/saving_dark.svg";
import savingW from "~~/public/common/saving_white.svg";
import { MemberSaving } from "~~/types/transaction/saving";

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
      <h4 className="mb-6 text-3xl font-light text-black dark:text-white">Resumen de ahorros</h4>

      <table className="flex flex-col">
        {transactions.length > 0 && (
          <thead>
            <tr className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
              <td className="p-2.5 xl:p-5">
                <h5 className="text-sm sm:text-base font-bold ">Ahorro</h5>
              </td>
              <td className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm sm:text-base font-bold">Hash</h5>
              </td>
              <td className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm sm:text-base font-bold">Fecha</h5>
              </td>
              <td className="p-2.5 text-center xl:p-5">
                <h5 className="text-[12px] sm:text-base font-bold">Proximo pago</h5>
              </td>
              <td className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm sm:text-base font-bold">Estatus</h5>
              </td>
            </tr>
          </thead>
        )}

        <tbody>
          {transactions.length === 0 && (
            <tr className="p-4 w-full grid grid-cols-1">
              <td className="flex flex-col-reverse items-center m-auto">
                <p className="text-center font-light text-xl text-gray-400">No se cuentan con contransacciones</p>
                <Image width={150} className="dark:hidden" src={savingW} alt="saving image" />
                <Image width={150} className="hidden dark:block" src={savingD} alt="saving image" />
              </td>
            </tr>
          )}
          {transactions.map((tx, key) => {
            return (
              <TransactionsTableRow
                key={tx._id}
                index={key}
                hash={tx.hash}
                value={tx.amount.$numberDecimal}
                date={tx.date}
                pyt={tx.pyt}
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
