import { useEffect } from "react";
import { useGetTokenData } from "../user/useGetTokenData";
import { useAccount } from "wagmi";
import { useGlobalState } from "~~/services/store/store";

export const useWalletDisconnect = () => {
  const setMemberStatus = useGlobalState(state => state.setIsActiveMemberStatus);
  const currentAccount = useAccount();
  const { tokenInfo } = useGetTokenData();

  useEffect(() => {
    if (currentAccount.isConnected) {
      const timer = setTimeout(() => {
        if (currentAccount.address === tokenInfo?.wallet) {
          setMemberStatus(true);
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentAccount.address, currentAccount.isConnected, setMemberStatus, tokenInfo?.wallet]);
};
