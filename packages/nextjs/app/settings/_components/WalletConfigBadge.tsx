import React from "react";
import { WithdrawalWallet } from "../page";
import BadgeStatus from "./BadgeStatus";

interface WalletConfigBadgeProps {
  withdrawalWallet: WithdrawalWallet;
}

const WalletConfigBadge: React.FC<WalletConfigBadgeProps> = ({ withdrawalWallet }) => {
  return (
    <div className="flex flex-col items-center">
      <p className="font-medium text-center text-sm">Status de wallet secundaria</p>
      <BadgeStatus
        status={withdrawalWallet === undefined ? "default" : withdrawalWallet.isActive ? "active" : "disable"}
      />
    </div>
  );
};

export default WalletConfigBadge;
