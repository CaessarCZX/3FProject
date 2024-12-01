import { BanknotesIcon, EyeIcon, UsersIcon } from "@heroicons/react/24/outline";
import { ContentStatsType } from "~~/types/cardstats";

const ContentStats: ContentStatsType[] = [
  {
    icon: EyeIcon,
    title: "Balance",
    total: "$3.456K",
    rate: "0.43%",
    levelUp: true,
    levelDown: false,
  },
  {
    icon: BanknotesIcon,
    title: "Total Retirado",
    total: "$3.456K",
    rate: "0.43%",
    levelUp: true,
    levelDown: false,
  },
  {
    icon: UsersIcon,
    title: "Miembros Afiliados",
    total: "15",
    rate: "25%",
    levelUp: true,
    levelDown: false,
  },
];

export default ContentStats;
