import React, { useState } from "react";
import UpdateWalletModal from "./UpdateWalletModal";
import { IoWalletOutline } from "react-icons/io5";
import { Btn } from "~~/components/UI/Button";
import InputField from "~~/components/UI/Input/InputField";
import { useModal } from "~~/hooks/3FProject/useModal";

interface WalletConfigChangeProps {
  secondWallet: string;
  id: string;
  updateFunction: (userId: string) => void;
}

const WalletConfigChange: React.FC<WalletConfigChangeProps> = ({ secondWallet, id, updateFunction }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newSecWallet, setNewSecWallet] = useState("");
  const { modalRef, openModal, closeModal } = useModal();

  const handleEditing = () => {
    setIsEditing(!isEditing);
    setNewSecWallet("");
  };

  const handleCloseModal = () => {
    closeModal();
    handleEditing();
  };

  return (
    <div className="flex flex-col gap-6">
      <InputField
        readOnly={!isEditing}
        className="text-sm"
        value={newSecWallet}
        onChange={e => setNewSecWallet(e.target.value)}
        placeholder={secondWallet ?? "No cuentas con una wallet secundaria registrada"}
        label="Wallet secundaria"
        icon={<IoWalletOutline className="text-gray-400" />}
      />
      <div className={`flex ${isEditing && "flex-col xsm:flex-row sm:justify-between gap-8"}`}>
        {!isEditing && (
          <Btn onClick={handleEditing} className="flex-1 animate-fadeIn">
            {secondWallet ? "Modificar wallet secundaria" : "Agregar wallet secundaria"}
          </Btn>
        )}
        {isEditing && (
          <>
            <Btn onClick={openModal} className="flex-1">
              Guardar wallet
            </Btn>
            <dialog id="my_modal_3" className="modal" ref={modalRef}>
              <UpdateWalletModal
                id={id}
                wallet={newSecWallet}
                closeFunction={handleCloseModal}
                updateFunction={updateFunction}
              />
            </dialog>
            <button onClick={handleEditing} className="btn btn-outline btn-error flex-1">
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default WalletConfigChange;
