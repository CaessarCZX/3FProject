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
    className={`border border-gray-300 dark:border-strokedark  rounded-md p-4 flex gap-4 bg-gradient-to-br from-gray-200/80 via-gray-100 to-gray-300/90 backdrop-blur-sm ${className}`}
  >
    <div className={`p-4 rounded-xl ${colorBadge} shrink-0`}>
      {icon}
      {/* <IoWalletOutline className="w-12 h-12 text-brand-default" /> */}
    </div>
    <div className="list-none flex flex-col flex-1 min-w-0 gap-2">
      <div className="font-medium break-words">{title}</div>
      <div className="break-all">
        <div className="flex items-center">
          <p className="font-light xsm:text-xs sm:text-sm max-w-fit tracking-widest text-gray-500 m-0">
            {walletAddress?.substring(0, 12)}...{walletAddress?.substring(walletAddress.length - 7)}
          </p>
          <CopyAddress address={walletAddress} size={5} color="purple-400" colorSuccess="green-500" />
        </div>
      </div>
    </div>
  </div>
);

export default WalletConfigCard;
