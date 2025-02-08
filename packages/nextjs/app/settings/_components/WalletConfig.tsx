import React from "react";
import { WithdrawalWallet } from "../page";
import WalletConfigActivator from "./WalletConfigActivator";
import WalletConfigChange from "./WalletConfigChange";
import WalletConfigDelete from "./WalletConfigDelete";
import BlockContainerWithTitle from "~~/components/UI/BlockContainerWithTitle";
import { useGetTokenData } from "~~/hooks/user/useGetTokenData";

interface WalletConfigProps {
  withdrawalWallet: WithdrawalWallet;
  updateFunction: (userId: string) => void;
}

const WalletConfig: React.FC<WalletConfigProps> = ({ withdrawalWallet, updateFunction }) => {
  const {
    tokenInfo: { id },
  } = useGetTokenData();

  return (
    <BlockContainerWithTitle title="Pago de comisiones">
      <WalletConfigActivator updateFunction={updateFunction} id={id} withdrawalWallet={withdrawalWallet} />
      <div className="my-4">
        <WalletConfigChange updateFunction={updateFunction} id={id} secondWallet={withdrawalWallet.wallet} />
      </div>
      {withdrawalWallet.wallet && (
        <div className="border-t border-stroke">
          <WalletConfigDelete id={id} />
        </div>
      )}
    </BlockContainerWithTitle>
  );
};

export default WalletConfig;
