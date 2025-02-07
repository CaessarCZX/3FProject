import React, { useState } from "react";
import { IoWalletOutline } from "react-icons/io5";
import { Btn, BtnLoading } from "~~/components/UI/Button";
import InputField from "~~/components/UI/Input/InputField";
import { useAddWithdrawalWallet } from "~~/hooks/withdrawalWallet/useAddWithdrawalWallet";

interface WalletConfigChangeProps {
  secondWallet: string;
  id: string;
  updateFunction: (userId: string) => void;
}

const WalletConfigChange: React.FC<WalletConfigChangeProps> = ({ secondWallet, id, updateFunction }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newSecWallet, setNewSecWallet] = useState("");
  const { isLoading, addWallet } = useAddWithdrawalWallet();

  const handleAddWallet = async () => {
    const done = await addWallet({ wallet: newSecWallet, id });
    if (done) {
      setIsEditing(false);
      updateFunction(id);
    }
  };

  const handleEditing = () => {
    setIsEditing(!isEditing);
    setNewSecWallet("");
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
      <div className={`flex ${isEditing && "justify-between gap-8"}`}>
        {!isEditing && (
          <Btn onClick={handleEditing} className="flex-1 animate-fadeIn">
            {secondWallet ? "Modificar wallet secundaria" : "Agregar wallet secundaria"}
          </Btn>
        )}
        {isEditing && (
          <>
            <Btn onClick={handleAddWallet} className="flex-1" disabled={isLoading}>
              <BtnLoading text="Guardar wallet" changeState={isLoading} />
            </Btn>
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
