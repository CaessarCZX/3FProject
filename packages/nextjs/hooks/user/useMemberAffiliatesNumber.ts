import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const useMemberAffiliatesNumber = () => {
  const currentMember = useAccount();
  const { data: totalAffiliates } = useScaffoldReadContract({
    contractName: "FFFBusiness",
    functionName: "getTotalAffiliatesPerMember",
    args: [currentMember?.address],
  });

  return totalAffiliates || null;
};
