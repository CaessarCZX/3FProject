import React from "react";
import { useDeleteWithdrawalWallet } from "~~/hooks/withdrawalWallet/useDeleteWithdrawalWallet";

interface WalletConfigDeleteProps {
  id: string;
}

const WalletConfigDelete: React.FC<WalletConfigDeleteProps> = ({ id }) => {
  const { isLoading, deleteWallet } = useDeleteWithdrawalWallet();

  const handleDeleteWallet = async () => {
    await deleteWallet({ id });
  };

  return (
    <div className="">
      <p className="font-medium text-sm text-center">Eliminar wallet secundaria</p>
      <button onClick={handleDeleteWallet} disabled={isLoading} className="btn text-xs btn-outline px-8 py-3 btn-error">
        Eliminar wallet
      </button>
    </div>
  );
};

export default WalletConfigDelete;
