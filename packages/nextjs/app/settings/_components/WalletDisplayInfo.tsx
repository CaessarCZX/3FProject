import React from "react";
import WalletConfigCard, { WalletConfigCardProps } from "./WalletConfigCard";
import { BiMoneyWithdraw } from "react-icons/bi";
import { IoWalletOutline } from "react-icons/io5";
import { useGetTokenData } from "~~/hooks/user/useGetTokenData";

const WalletDisplayInfo = () => {
  const {
    tokenInfo: { wallet },
  } = useGetTokenData();

  const walletInfo: WalletConfigCardProps[] = [
    {
      icon: <IoWalletOutline className="w-10 h-10 text-orange-500 dark:text-[#f4a259]" />,
      title: "Wallet predeterminada de cuenta",
      walletAddress: wallet,
      colorBadge: "bg-[#f4a25980]",
    },
    {
      icon: <BiMoneyWithdraw className="w-10 h-10 text-green-500 dark:text-[#80ed99]" />,
      title: "Wallet para recepción de pagos",
      walletAddress: wallet,
      colorBadge: "bg-[#80ed9980]",
    },
  ];
  return (
    <article className="grid grid-cols-4 gap-4">
      {walletInfo.map((card, index) => (
        <WalletConfigCard
          className="col-span-4 md:col-span-2 xl:col-span-4"
          key={index}
          icon={card.icon}
          title={card.title}
          walletAddress={card.walletAddress}
          colorBadge={card.colorBadge}
        />
      ))}
    </article>
  );
};

export default WalletDisplayInfo;
