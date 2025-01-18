import React from "react";
import { StageTransactionModal } from "~~/components/Actions/Transaction/StageTransactionModal";
import useFirstDepositContract from "~~/hooks/contract/useFirstDepositContract";

const FirstDepositButton = ({ depositAmount }: { depositAmount: string }) => {
  const { isHandleModalActivate, isStarted, transaction, HandleDeposit } = useFirstDepositContract();
  return (
    <>
      <button
        className={`w-full mt-4 sm:w-auto sm:mt-0 sm:absolute sm:right-2.5 sm:top-1/2 sm:-translate-y-1/2 py-2.5 px-8 text-white font-bold bg-brand-default hover:bg-brand-hover dark:bg-blue-600 dark:hover:bg-opacity-90 duration-300 z-50 rounded-full ${
          isStarted && "hidden"
        }`}
        onClick={() => HandleDeposit({ depositAmount })}
      >
        {isStarted ? "Pendiente" : "Iniciar ahorro"}
      </button>

      {/* StageTransactionModal solo se activa cuando "isStarted" es true */}
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

export default FirstDepositButton;
