import React from "react";
import CopyAddress from "~~/components/Actions/CopyAddress";

// import { HeroIcon } from "~~/types/heroicon";

export interface WalletConfigCardProps {
  icon: React.ReactNode;
  walletAddress: string;
  title: string;
  colorBadge: string;
  className?: string;
}

const WalletConfigCard: React.FC<WalletConfigCardProps> = ({ icon, walletAddress, title, colorBadge, className }) => (
  <div
    className={`rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark flex gap-4 p-4 ${className}`}
  >
    <div className={`p-4 rounded-xl ${colorBadge} shrink-0`}>{icon}</div>
    <div className="list-none flex flex-col flex-1 min-w-0 gap-2">
      <div className="font-medium dark:text-whiten break-words">{title}</div>
      <div className="break-all">
        <div className="flex items-center">
          <p className="font-light xsm:text-xs sm:text-sm max-w-fit tracking-widest text-gray-500 dark:text-gray-400 m-0">
            {walletAddress?.substring(0, 12)}...{walletAddress?.substring(walletAddress.length - 7)}
          </p>
          <CopyAddress address={walletAddress} size={5} color="purple-400" colorSuccess="green-500" />
        </div>
      </div>
    </div>
  </div>
);

export default WalletConfigCard;
