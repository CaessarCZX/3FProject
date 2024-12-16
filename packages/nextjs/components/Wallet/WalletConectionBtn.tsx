"use client";

// @refresh reset
// import { Balance } from "../Balance";
import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { ArrowLeftOnRectangleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { WrongNetworkDropdown } from "~~/components/scaffold-eth/RainbowKitCustomConnectButton/WrongNetworkDropdown";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

/**
 * Custom Wagmi Connect Button (watch balance + custom design)
 */

type RainbowKitCustomConnectButtonProps = {
  classBtn?: string;
  enableWallet: boolean;
};

export const WalletConnectionBtn: React.FC<RainbowKitCustomConnectButtonProps> = ({ classBtn, enableWallet }) => {
  const { targetNetwork } = useTargetNetwork();
  const { disconnect } = useDisconnect();
  const [delayResponse, setDelayResponse] = useState<boolean>();
  const currentAccount = useAccount();

  // For connecting state
  useEffect(() => {
    if (currentAccount.isConnecting) {
      setDelayResponse(true);
    }
  }, [currentAccount]);

  // To disable connecting state
  useEffect(() => {
    if (delayResponse) {
      const delayTimer = setTimeout(() => setDelayResponse(false), 5500);
      return () => clearTimeout(delayTimer);
    }
  }, [delayResponse]);

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;
        // console.log(`mounted: ${mounted}, account: ${account}, chain: ${chain}`)

        return (
          <>
            {(() => {
              // Not connected
              if (!connected) {
                return (
                  <button className={`btn btn-primary ${classBtn ?? ""}`} onClick={openConnectModal} type="button">
                    Conecta tu Wallet
                  </button>
                );
              }

              // For error state
              if (chain.unsupported || chain.id !== targetNetwork.id) {
                return <WrongNetworkDropdown />;
              }

              // Connecting state
              if (delayResponse) {
                return (
                  <button className={`btn w-full bg-slate-400 ${classBtn ?? ""}`} type="button">
                    <span className="loading loading-spinner loading-md bg-white"></span>
                  </button>
                );
              }

              // Connected status
              return (
                <button
                  className={`btn ${
                    !enableWallet ? "bg-red-500 dark:bg-red-700" : "bg-green-500 dark:bg-green-700"
                  }  focus-visible:outline-none focus:outline-none focus-within:outline-none ${classBtn ?? ""}`}
                  type="button"
                  onClick={() => disconnect()}
                >
                  {!enableWallet ? (
                    <>
                      <ExclamationCircleIcon className="h-8 w-6 ml-2 sm:ml-0 text-white" />
                      <span className="text-white">Wallet no aceptada</span>
                    </>
                  ) : (
                    <>
                      <ArrowLeftOnRectangleIcon className="h-8 w-6 ml-2 sm:ml-0 text-white" />
                      <span className="text-white">Wallet aceptada</span>
                    </>
                  )}
                </button>
              );
            })()}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};
