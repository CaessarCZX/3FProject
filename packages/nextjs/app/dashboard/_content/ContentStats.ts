import { BanknotesIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useGetMemberBalance } from "~~/hooks/user/useMemberBalance";
import { ContentStatsType } from "~~/types/cardstats";
import { formatCurrency } from "~~/utils/3FContract/currencyConvertion";

const useGetContentStats = () => {
  const currentBalance = useGetMemberBalance();

  const dolarBalance = Number(currentBalance);

  const ContentStats: ContentStatsType[] = [
    {
      icon: EyeIcon,
      title: "Balance",
      total: formatCurrency(dolarBalance) ?? "",
      rate: "",
      levelUp: true,
      levelDown: false,
    },
    {
      icon: BanknotesIcon,
      title: "Total Retirado",
      total: "$0.00",
      rate: "",
      levelUp: true,
      levelDown: false,
    },
  ];

  return ContentStats;
};

export default useGetContentStats;
