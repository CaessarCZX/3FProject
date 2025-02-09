import React from "react";
import { useDeleteWithdrawalWallet } from "~~/hooks/withdrawalWallet/useDeleteWithdrawalWallet";

interface WalletConfigDeleteProps {
  id: string;
  updateFunction: (userId: string) => void;
}

const WalletConfigDelete: React.FC<WalletConfigDeleteProps> = ({ id, updateFunction }) => {
  const { isLoading, deleteWallet } = useDeleteWithdrawalWallet();

  const handleDeleteWallet = async () => {
    const done = await deleteWallet({ id });
    if (done) updateFunction(id);
  };

  return (
    <div className="">
      <p className="font-medium text-sm">Eliminar wallet secundaria</p>
      <button
        onClick={handleDeleteWallet}
        disabled={isLoading}
        className="btn text-xs btn-outline w-full px-8 py-3 btn-error"
      >
        Eliminar wallet
      </button>
    </div>
  );
};

export default WalletConfigDelete;
