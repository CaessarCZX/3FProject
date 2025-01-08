import { useGetTokenData } from "../user/useGetTokenData";
import { useAccount } from "wagmi";
import { useGlobalState } from "~~/services/store/store";

export const useInitializeMemberStatus = () => {
  const { tokenInfo } = useGetTokenData();
  const currentAccount = useAccount();
  const memberAddress = currentAccount.address ?? "0x0";
  const setIsActiveMemberStatus = useGlobalState(state => state.setIsActiveMemberStatus);
  const setIsMemberStatusFetching = useGlobalState(state => state.setIsMemberStatusFetching);

  const getCurrentMemberStatus = () => {
    setIsMemberStatusFetching(true);
    if (tokenInfo?.membership !== 0 && memberAddress !== "0x0") setIsActiveMemberStatus(true);
    setIsMemberStatusFetching(false);
  };

  return {
    getCurrentMemberStatus,
  };
};
