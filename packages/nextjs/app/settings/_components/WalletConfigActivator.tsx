import React, { useEffect, useState } from "react";
import { WithdrawalWallet } from "../page";
import ToggleConfig from "./ToggleConfig";
import { useWithdrawalWalletActivator } from "~~/hooks/withdrawalWallet/useWithdrawalWalletActivator";

interface WalletConfigActivatorProps {
  withdrawalWallet: WithdrawalWallet;
  id: string;
  updateFunction: (userId: string) => void;
}

const WalletConfigActivator: React.FC<WalletConfigActivatorProps> = ({ withdrawalWallet, id, updateFunction }) => {
  const [useSecWallet, setUseSecWallet] = useState(withdrawalWallet.isActive ?? false);
  const { isLoading, walletActivator } = useWithdrawalWalletActivator();

  useEffect(() => {
    setUseSecWallet(withdrawalWallet.isActive ?? false);
  }, [withdrawalWallet.isActive]);

  const handleWalletActivator = async () => {
    const done = await walletActivator({ isActive: !useSecWallet, id });
    if (done) {
      setUseSecWallet(prev => !prev);
      updateFunction(id);
    }
  };

  return (
    <div>
      <div className="space-y-4">
        <p className="m-0 font-medium text-sm">Recepción de fondos</p>
        <ToggleConfig
          id="enable-sec-wallet"
          disabled={isLoading}
          checked={useSecWallet}
          onChange={handleWalletActivator}
          label="Utilizar wallet secundaria para recibir pagos"
        />
      </div>
    </div>
  );
};

export default WalletConfigActivator;
