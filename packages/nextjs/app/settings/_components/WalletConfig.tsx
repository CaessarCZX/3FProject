import React from "react";
import WalletConfigCard, { WalletConfigCardProps } from "./WalletConfigCard";
import { IoWalletOutline } from "react-icons/io5";
import BlockContainerWithTitle from "~~/components/UI/BlockContainerWithTitle";
// import { AddressInput } from "~~/components/scaffold-eth";
import { useGetTokenData } from "~~/hooks/user/useGetTokenData";

const WalletConfig: React.FC = () => {
  const {
    tokenInfo: { wallet },
  } = useGetTokenData();

  const walletInfo: WalletConfigCardProps[] = [
    {
      icon: <IoWalletOutline className="w-12 h-12 text-brand-default" />,
      title: "Wallet registrada en cuenta",
      walletAddress: wallet,
      colorBadge: "bg-orange-300",
    },
    {
      icon: <IoWalletOutline className="w-12 h-12 text-brand-default" />,
      title: "Wallet para recepcion de pagos",
      walletAddress: wallet,
      colorBadge: "bg-green-200",
    },
  ];
  return (
    <BlockContainerWithTitle title="Recepción de pagos">
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
    </BlockContainerWithTitle>
  );
};

export default WalletConfig;
