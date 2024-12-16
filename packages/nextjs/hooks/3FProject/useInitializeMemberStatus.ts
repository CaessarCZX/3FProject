import { useScaffoldReadContract } from "../scaffold-eth";
import { useAccount } from "wagmi";
import { useGlobalState } from "~~/services/store/store";

export const useInitializeMemberStatus = () => {
  const currentAccount = useAccount();
  const memberAddress = currentAccount.address ?? "0x0";
  const setIsActiveMemberStatus = useGlobalState(state => state.setIsActiveMemberStatus);
  const setIsMemberStatusFetching = useGlobalState(state => state.setIsMemberStatusFetching);

  const { data: checkActiveMember } = useScaffoldReadContract({
    contractName: "FFFBusiness",
    functionName: "checkActiveMember",
    args: [memberAddress],
  });

  const getCurrentMemberStatus = () => {
    setIsMemberStatusFetching(true);
    if (checkActiveMember && memberAddress !== "0x0") setIsActiveMemberStatus(true);
    setIsMemberStatusFetching(false);
  };

  return {
    getCurrentMemberStatus,
  };
};
