import { useEffect, useState } from "react";
import { TransactionSteps } from "./TransactionSteps";
import RotatingPhrases from "~~/components/UI/Phrases";
import { useModal } from "~~/hooks/3FProject/useModal";
import { TransactionInfo } from "~~/utils/3FContract/deposit";

export type HandleModalProps = {
  activate: boolean;
  transaction: TransactionInfo;
  transactionDescription: string | null;
};

export const StageTransactionModal = ({ activate, transaction, transactionDescription }: HandleModalProps) => {
  const [openFirst, setIsOpenFirst] = useState(true);
  const { modalRef, openModal } = useModal();

  const depositUSDTPhrases = [
    "Iniciando transacción segura de USDT",
    "Conectando con la red blockchain",
    "Verificando dirección del wallet",
    "Preparando transferencia de fondos",
    "Validando credenciales de seguridad",
    "Procesando firma digital",
    "Confirmando saldo disponible",
    "Generando hash de transacción",
    "Enviando USDT a tu wallet destino",
    "Esperando confirmación de la red",
    "Validando transferencia en blockchain",
    "Transacción en progreso...",
    "Verificando múltiples nodos de red",
    "Optimizando comisión de gas",
    "Completando proceso de depósito",
    "Confirmación final en proceso",
  ];
  useEffect(() => {
    if (activate && openFirst) {
      setIsOpenFirst(false);
      openModal();
    }
  }, [activate, openFirst, openModal]);

  return (
    <>
      <button className="btn" onClick={openModal}>
        Transaccion en proceso
      </button>
      <dialog ref={modalRef} id="my_modal_5" className="modal ml-0">
        <div className="modal-box rounded-md sm:w-11/12 sm:max-w-2xl dark:bg-[#0b1727]">
          <div className="mx-auto pl-4 sm:container">
            <div>
              <div className="flex items-start sm:items-center justify-between">
                <h2 className="mb-0 text-2xl font-semibold text-dark dark:text-white">Transacción en proceso</h2>
                <div className="modal-action mt-0">
                  <form method="dialog">
                    <button className="p-2 text-xl">&#x2715;</button>
                  </form>
                </div>
              </div>
              <div className="text-base mt-1 mb-4 font-light text-gray-400 dark:text-dark-6">
                <RotatingPhrases phrases={depositUSDTPhrases} />
              </div>
            </div>
          </div>
          <TransactionSteps transaction={transaction} description={transactionDescription || ""} />
        </div>
      </dialog>
    </>
  );
};
