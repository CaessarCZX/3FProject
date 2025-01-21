import { useEffect } from "react";
import { useGetTokenData } from "../user/useGetTokenData";
import { useGetMemberBalance } from "../user/useMemberBalance";
import { useGlobalState } from "~~/services/store/store";

export const useInitializeMemberBalance = () => {
  const currentBalance = useGetMemberBalance();
  const { tokenInfo } = useGetTokenData();
  const setMemberBalance = useGlobalState(state => state.setMemberBalance);

  useEffect(() => {
    if (tokenInfo && currentBalance === 0) {
      setMemberBalance(tokenInfo.balance || 0);
    }
  }, [setMemberBalance, tokenInfo, currentBalance]);
};
