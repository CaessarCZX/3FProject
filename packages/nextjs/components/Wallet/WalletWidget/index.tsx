import React, { useState } from "react";
import { Balance } from "./Balance";
import GlasRainbowCard from "./GlasRainbowCard";
import CopyToClipboard from "react-copy-to-clipboard";
import { IoWalletOutline } from "react-icons/io5";
import { useAccount } from "wagmi";
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const WalletWidget: React.FC = () => {
  const currentAccount = useAccount();
  const checkSumAddress = currentAccount.address ?? "0x";
  const [addressCopied, setAddressCopied] = useState<boolean>();
  const [hideBalance, setHideBalance] = useState(false);

  const handleToggleBalanceVisibility = () => {
    setHideBalance(!hideBalance);
  };

  return (
    <GlasRainbowCard>
      <div className="px-4 py-4 min-w-[254px] max-w-[254px]">
        <div className="flex items-center mb-2 gap-1 justify-between">
          <div className="font-light text-sm tracking-wide text-gray-300 group-hover:text-gray-200">Tu Wallet</div>
          {/* Eye Icon Button */}
          <button onClick={handleToggleBalanceVisibility}>
            {hideBalance ? (
              <EyeSlashIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-200" />
            ) : (
              <EyeIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-200" />
            )}
          </button>
        </div>
        <div className=" mb-2 space-x-2">
          {hideBalance ? (
            <span className={`font-light text-white text-2xl tracking-widest`}>********</span>
          ) : (
            <Balance address={currentAccount.address} />
          )}
        </div>
        <div className="flex items-center mb-1">
          <IoWalletOutline className="w-5 h-5 text-blue-500 group-hover:text-white" />
          <span className="ml-2 font-light flex items-center">
            <div className="tracking-widest text-gray-400 text-[11px] group-hover:text-gray-200">
              {checkSumAddress?.substring(0, 8)}...{checkSumAddress?.substring(checkSumAddress.length - 4)}
            </div>
            {addressCopied ? (
              <CheckCircleIcon
                className="ml-1.5 text-xl font-normal text-green-300 h-3 w-3 cursor-pointer"
                aria-hidden="true"
              />
            ) : (
              <CopyToClipboard
                text={checkSumAddress}
                onCopy={() => {
                  setAddressCopied(true);
                  setTimeout(() => {
                    setAddressCopied(false);
                  }, 800);
                }}
              >
                <DocumentDuplicateIcon
                  className="ml-1.5 text-xl font-normal text-purple-400 h-3 w-3 cursor-pointer group-hover:text-purple-200"
                  aria-hidden="true"
                />
              </CopyToClipboard>
            )}
          </span>
        </div>
      </div>
    </GlasRainbowCard>
  );
};

export default WalletWidget;
