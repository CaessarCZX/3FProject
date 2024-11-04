import { useEffect, useState } from "react";
import { CheckBadgeIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { TransactionHash } from "~~/app/dashboard/_components/TransactionHash";
import { useModal } from "~~/hooks/3FProject/useModal";

type HandleModalProps = {
  activate: boolean;
  transactionHash: string | undefined;
  transactionReceiptHash: string | undefined;
  finalTransactionReceiptHash: string | undefined;
  error: string | undefined;
  transactionDescription: string | null;
};

export const StageTransactionModal = ({
  activate,
  transactionHash,
  transactionReceiptHash,
  finalTransactionReceiptHash,
  error,
  transactionDescription,
}: HandleModalProps) => {
  const [openFirst, setIsOpenFirst] = useState(true);
  const { modalRef, openModal } = useModal();
  console.log(
    activate,
    transactionHash,
    transactionReceiptHash,
    finalTransactionReceiptHash,
    error,
    transactionDescription,
  );

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
      <dialog ref={modalRef} id="my_modal_5" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">
            {transactionReceiptHash ? "Transaccion Preparada" : "Preparando transaccion "}
          </h3>
          <div className="flex justify-center gap-4">
            <div className="flex items-center gap-6">
              <div className="flex p-3 border border-slate-200">
                <span className="mr-4 text-sm">Hash de transaccion</span>
                {transactionHash && <TransactionHash hash={transactionHash} />}
              </div>
              <div
                className={`badge ${transactionReceiptHash ? "badge-success" : "badge-accent badge-outline"} p-4 gap-2`}
              >
                {transactionReceiptHash ? (
                  <CheckCircleIcon className="w-5" />
                ) : (
                  <ExclamationCircleIcon className="w-5" />
                )}
                {transactionReceiptHash ? "Completado" : "Cargando"}
              </div>
            </div>
            {transactionReceiptHash && (
              <div className="flex items-center gap-6">
                <div className="flex p-3 border border-slate-200">
                  <span className="mr-4 text-sm">Hash de verficacion</span>
                  {transactionReceiptHash && <TransactionHash hash={transactionReceiptHash} />}
                </div>
                <div
                  className={`badge ${
                    transactionReceiptHash ? "badge-success" : "badge-accent badge-outline"
                  } p-4 gap-2`}
                >
                  <CheckBadgeIcon className="w-5" />
                  Completado
                </div>
              </div>
            )}
          </div>
          {transactionReceiptHash && (
            <div className="w-full text-center">
              <p className="font-bold text-lg">Transaccion verificada</p>
              {!finalTransactionReceiptHash && !error && <p>Procesando solicitud</p>}
              {finalTransactionReceiptHash && !error && <p>Transaccion completada</p>}
              {!finalTransactionReceiptHash && error && <p>Ha ocurrido un error</p>}
              {finalTransactionReceiptHash && <p className="font-bold text-3xl">{transactionDescription}</p>}
            </div>
          )}
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Cerrar</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};
