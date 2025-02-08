import React from "react";
import Image from "next/image";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import { Btn, BtnLoading } from "~~/components/UI/Button";
import { useAddWithdrawalWallet } from "~~/hooks/withdrawalWallet/useAddWithdrawalWallet";

interface UpdateWalletModalProps {
  wallet: string;
  id: string;
  closeFunction: () => void;
  updateFunction: (userId: string) => void;
}

const UpdateWalletModal: React.FC<UpdateWalletModalProps> = ({ closeFunction, id, wallet, updateFunction }) => {
  const { isLoading, addWallet } = useAddWithdrawalWallet();

  const handleAddWallet = async () => {
    const done = await addWallet({ wallet, id });
    if (done) {
      closeFunction();
      updateFunction(id);
    }
  };

  return (
    <div className="modal-box p-8">
      <form method="dialog">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div className="flex items-center gap-4">
        <ShieldExclamationIcon className="w-14 h-14 xsm:w-8 xsm:h-8 text-brand-default dark:text-yellow-400" />
        <h3 className="font-medium text-xl sm:text-2xl dark:text-whiten">¡Actualizar wallet secundaria!</h3>
      </div>

      <div className="flex pt-6">
        <div className="hidden  sm:block flex-shrink-0 self-end mr-4">
          <Image width={180} height={200} src={"/common/undraw_businessman.svg"} alt="hombre de negocios" />
        </div>
        <div className="mr-4">
          <h2 className="font-medium text-xl">Toma un momento para leer esto.</h2>
          <p className="font-light text-xs text-gray-500 text-pretty sm:max-w-[236px]">
            Estás a punto de actualizar la dirección de tu wallet secundaria para recibir pagos. Por razones de
            seguridad, una vez realizado el cambio, se aplicará un{" "}
            <strong className="dark:text-gray-50">bloqueo de activación de 24 horas</strong>. Durante este período, no
            podrás recibir pagos en la nueva dirección.
          </p>
          <p className="font-light text-xs text-gray-500 text-pretty sm:max-w-[236px]">
            Una vez transcurrido el tiempo de espera, la wallet ingresada podrá ser elegible para ser utilizada.
          </p>
        </div>
      </div>
      <div>
        <p className="text-lg">¿Deseas continuar con la actualización?</p>
      </div>
      <div className="flex gap-8">
        <Btn onClick={handleAddWallet} className="flex-1" disabled={isLoading}>
          <BtnLoading text="Continuar" changeState={isLoading} />
        </Btn>
        <button onClick={closeFunction} disabled={isLoading} className="btn btn-outline btn-error flex-1">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default UpdateWalletModal;
