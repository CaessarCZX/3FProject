"use client";

// @refresh reset
// import { Balance } from "../Balance";
import React, { useEffect, useState } from "react";
import GlasRainbowCard from "../WalletWidget/GlasRainbowCard";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { CpuChipIcon } from "@heroicons/react/24/solid";
import { WrongNetworkDropdown } from "~~/components/scaffold-eth/RainbowKitCustomConnectButton/WrongNetworkDropdown";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useGlobalState } from "~~/services/store/store";

/**
 * Custom Wagmi Connect Button (watch balance + custom design)
 */

type RainbowKitCustomConnectButtonProps = {
  classBtn?: string;
  enableWallet: boolean;
};

export const PageWalletConnectionBtn: React.FC<RainbowKitCustomConnectButtonProps> = ({ enableWallet }) => {
  const { targetNetwork } = useTargetNetwork();
  const { disconnect } = useDisconnect();
  const [delayResponse, setDelayResponse] = useState<boolean>();
  const [delayDisconnection, setDelayDisconnection] = useState(false);
  const currentAccount = useAccount();
  const setMemberStatus = useGlobalState(state => state.setIsActiveMemberStatus); // Para estado global

  // For fetching member status
  useEffect(() => {
    // For automatic disconnection
    if (currentAccount.isConnected && !enableWallet) {
      const delayTimer = setTimeout(() => setDelayDisconnection(true), 2500);
      return () => clearTimeout(delayTimer);
    }

    if (currentAccount.isDisconnected) {
      setMemberStatus(false); // Elimina el status del miembro en caso de que la wallet se desconecte
    }
  }, [currentAccount, setMemberStatus, enableWallet]);

  // For connecting state
  useEffect(() => {
    if (currentAccount.isConnecting) {
      setDelayResponse(true);
    }
  }, [currentAccount, enableWallet]);

  // To disable connecting state
  useEffect(() => {
    if (delayResponse) {
      const delayTimer = setTimeout(() => setDelayResponse(false), 2500);
      return () => clearTimeout(delayTimer);
    }

    if (delayDisconnection) {
      const delayTimer = setTimeout(() => {
        disconnect();
        setDelayDisconnection(false);
      }, 2000);
      return () => clearTimeout(delayTimer);
    }
  }, [delayDisconnection, delayResponse, disconnect]);

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;

        return (
          <>
            {(() => {
              // Not connected
              if (!connected) {
                return (
                  <GlasRainbowCard>
                    <div
                      role="button"
                      onClick={openConnectModal}
                      className="px-4 py-4 min-w-[254px] max-w-[254px] w-full flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Conecta una wallet
                      <span>
                        <CpuChipIcon className="w-8 h-8" />
                      </span>
                    </div>
                  </GlasRainbowCard>
                );
              }

              // For error state
              if (chain.unsupported || chain.id !== targetNetwork.id) {
                return <WrongNetworkDropdown />;
              }

              // Connecting state
              if (delayResponse) {
                return (
                  <GlasRainbowCard>
                    <div
                      role="button"
                      className="px-4 py-4 min-w-[254px] max-w-[254px] w-full flex items-center justify-center cursor-progress"
                    >
                      <span className="loading loading-spinner loading-md bg-white"></span>
                    </div>
                  </GlasRainbowCard>
                );
              }

              // Connected status
              return (
                <GlasRainbowCard>
                  <div
                    role="button"
                    onClick={() => disconnect()}
                    className="px-4 py-4 min-w-[254px] max-w-[254px] w-full flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {!enableWallet && (
                      <>
                        <ExclamationCircleIcon className="h-8 w-8 text-white" />
                        <span className="text-white">
                          {!delayDisconnection ? "Wallet no aprobada" : "Desconectando"}
                        </span>
                      </>
                    )}
                  </div>
                </GlasRainbowCard>
              );
            })()}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};
