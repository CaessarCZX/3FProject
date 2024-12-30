import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { BanknotesIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { ContentStatsType } from "~~/types/cardstats";
import { formatCurrency } from "~~/utils/3FContract/currencyConvertion";

const useGetContentStats = () => {
  const currentMember = useAccount();
  const { data: memberBalance } = useScaffoldReadContract({
    contractName: "FFFBusiness",
    functionName: "getMemberBalance",
    args: [currentMember?.address],
  });

  const dolarBalance = Number(formatUnits(BigInt(memberBalance || 0), 6));

  const ContentStats: ContentStatsType[] = [
    {
      icon: EyeIcon,
      title: "Balance",
      total: formatCurrency(dolarBalance) ?? "",
      rate: "0.43%",
      levelUp: true,
      levelDown: false,
    },
    {
      icon: BanknotesIcon,
      title: "Total Retirado",
      total: "$0.00",
      rate: "0.43%",
      levelUp: true,
      levelDown: false,
    },
  ];

  return ContentStats;
};

export default useGetContentStats;
