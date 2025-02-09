import React, { useEffect, useState } from "react";
import { WithdrawalWallet } from "../_types";
import ToggleConfig from "./ToggleConfig";
import { useShowUiNotifications } from "~~/hooks/3FProject/useShowUiNotifications";
import { useWithdrawalWalletActivator } from "~~/hooks/withdrawalWallet/useWithdrawalWalletActivator";

interface WalletConfigActivatorProps {
  withdrawalWallet: WithdrawalWallet;
  id: string;
  updateFunction: (userId: string) => void;
}

const WalletConfigActivator: React.FC<WalletConfigActivatorProps> = ({ withdrawalWallet, id, updateFunction }) => {
  const [useSecWallet, setUseSecWallet] = useState(withdrawalWallet.isActive ?? false);
  const { isLoading, walletActivator } = useWithdrawalWalletActivator();
  const [error, setError] = useState("");
  useShowUiNotifications({ error, setError });

  useEffect(() => {
    setUseSecWallet(withdrawalWallet.isActive ?? false);
  }, [withdrawalWallet.isActive]);

  const calculateReleaseDate = () => {
    if (!withdrawalWallet.wallet) return setError("Wallet secundaria no disponible");
    const releaseTimestamp = new Date(withdrawalWallet.releaseDate).getTime();
    const currentTimestamp = Date.now();
    if (releaseTimestamp > currentTimestamp) {
      const diffTimestamp = releaseTimestamp - currentTimestamp;
      const hours = Math.floor(diffTimestamp / (1000 * 60 * 60));
      const minutes = Math.floor((diffTimestamp % (1000 * 60 * 60)) / (1000 * 60));
      setError(`Wallet no es accesible hasta dentro de ${hours} horas con ${minutes} minutos`);
      return null;
    }
    return true;
  };

  const handleWalletActivator = async () => {
    if (!calculateReleaseDate()) return;
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
