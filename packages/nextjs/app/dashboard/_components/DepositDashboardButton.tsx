import React from "react";
import { StageTransactionModal } from "~~/components/Actions/Transaction/StageTransactionModal";
import useDepositContract from "~~/hooks/contract/useDepositContract";

const DepositDashboardButton: React.FC<{ depositAmount: string }> = ({ depositAmount }) => {
  const { isHandleModalActivate, isStarted, transaction, HandleDeposit } = useDepositContract();
  return (
    <>
      {!isStarted && (
        <button
          type="button"
          className="text-white bg-brand-default disabled:bg-slate-500 hover:bg-brand-hover focus:ring-4 focus:outline-none font-medium rounded-md text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700"
          onClick={() => HandleDeposit({ depositAmount })}
        >
          {isStarted ? "Pendiente" : "Depositar"}
        </button>
      )}
      {isStarted && (
        <StageTransactionModal
          activate={isHandleModalActivate}
          transaction={transaction}
          transactionDescription="Deposito Exitoso"
        />
      )}
    </>
  );
};

export default DepositDashboardButton;
