import { useEffect, useState } from "react";
import { TransactionSteps } from "./TransactionSteps";
import { useModal } from "~~/hooks/3FProject/useModal";

export type HandleModalProps = {
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

  console.log(transactionDescription);
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
        <div className="modal-box w-11/12 max-w-5xl dark:bg-[#0b1727]">
          <TransactionSteps
            transactionHash={transactionHash || ""}
            transactionReceiptHash={transactionReceiptHash || ""}
            finalTransactionReceiptHash={finalTransactionReceiptHash || ""}
            error={error}
          />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Cerrar</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};
