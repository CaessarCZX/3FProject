import React from "react";
import { StageTransactionModal } from "~~/components/Actions/Transaction/StageTransactionModal";
import useDepositContract from "~~/hooks/contract/useDepositContract";

const CommonDepositButton = ({ depositAmount }: { depositAmount: string }) => {
  const { isHandleModalActivate, isStarted, transaction, HandleDeposit } = useDepositContract();
  return (
    <>
      {/* Botón para Web (solo visible en pantallas grandes) */}
      <button
        className={`absolute right-2.5 top-1/2 -translate-y-1/2 py-2.5 px-8 text-white font-bold bg-brand-default hover:bg-brand-hover dark:bg-blue-600 dark:hover:bg-opacity-90 duration-300 z-50 rounded-full ${
          isStarted && "hidden"
        } hidden sm:block`} // Se oculta en móviles y se muestra en pantallas grandes
        onClick={() => HandleDeposit({ depositAmount })}
      >
        {isStarted ? "Pendiente" : "Iniciar ahorro"}
      </button>

      {/* Botón para Móvil (solo visible en pantallas pequeñas) */}
      <button
        className={`mt-4 p-2.5 px-8 text-white font-bold bg-brand-default hover:bg-brand-hover dark:bg-blue-600 dark:hover:bg-opacity-90 duration-300 z-50 rounded-full w-full ${
          isStarted && "hidden"
        } sm:hidden`} // Se oculta en pantallas grandes y se muestra en móviles
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

export default CommonDepositButton;
