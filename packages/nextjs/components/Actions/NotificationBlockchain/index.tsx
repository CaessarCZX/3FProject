import React from "react";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useGetTokenData } from "~~/hooks/user/useGetTokenData";
import {
  listenToCommissions,
  listenToMembershipPaid,
  listenToNewSavings,
  listenToTransferBusiness,
} from "~~/services/NotificationBlockchain";
import { useGlobalState } from "~~/services/store/store";

const OneRenderBlockchainNotifications = () => {
  const setBlockchainNotifications = useGlobalState(state => state.setBlockchainNotifications);
  const { tokenInfo, tokenError } = useGetTokenData();
  const { data: contract } = useDeployedContractInfo("FFFBusiness");
  const currentContract = contract?.address ?? "0x";

  const { address, isConnected } = useAccount();

  useEffect(() => {
    console.log("Instanciacion de escucha de eventos");
    if (isConnected && address) {
      listenToCommissions(currentContract, address);
      listenToNewSavings(currentContract, address);
    }

    if (tokenError) return;

    if (isConnected && address && tokenInfo.isAdmin) {
      listenToTransferBusiness(currentContract);
      listenToMembershipPaid(currentContract);
    }

    setBlockchainNotifications(true);
  }, [address, currentContract, isConnected, setBlockchainNotifications, tokenError, tokenInfo]);

  return <div className="text-red-500">NotificationBlockchainEnabled</div>;
};

export default OneRenderBlockchainNotifications;
