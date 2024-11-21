import { useScaffoldReadContract } from "../scaffold-eth/useScaffoldReadContract";
import { useAccount } from "wagmi";

export const useMemberBalance = () => {
  const currentMember = useAccount();
  const { data: memberBalance } = useScaffoldReadContract({
    contractName: "FFFBusiness",
    functionName: "getMemberBalance",
    args: [currentMember?.address],
  });

  return memberBalance || null;
};
