import { useGetTokenData } from "../user/useGetTokenData";
import { useGlobalState } from "~~/services/store/store";

export const useInitializeMemberStatus = () => {
  const { tokenInfo } = useGetTokenData();
  const setIsActiveMemberStatus = useGlobalState(state => state.setIsActiveMemberStatus);

  const getCurrentMemberStatus = () => {
    if (tokenInfo?.membership !== 0) setIsActiveMemberStatus(true);
  };

  return {
    getCurrentMemberStatus,
  };
};
