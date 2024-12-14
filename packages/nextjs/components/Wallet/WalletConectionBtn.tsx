"use client";

// @refresh reset
// import { Balance } from "../Balance";
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useDisconnect } from "wagmi";
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

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;

        return (
          <>
            {(() => {
              if (!connected) {
                return (
                  <button className={`btn btn-primary ${classBtn ?? ""}`} onClick={openConnectModal} type="button">
                    Conecta tu Wallet
                  </button>
                );
              }

              if (chain.unsupported || chain.id !== targetNetwork.id) {
                return <WrongNetworkDropdown />;
              }

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
                      <ExclamationCircleIcon className="h-8 w-6 ml-2 sm:ml-0" />
                      <span>Wallet no aceptada</span>
                    </>
                  ) : (
                    <>
                      <ArrowLeftOnRectangleIcon className="h-8 w-6 ml-2 sm:ml-0" />
                      <span>Wallet aceptada</span>
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
