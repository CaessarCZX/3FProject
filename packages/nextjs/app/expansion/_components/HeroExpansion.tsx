"use client";

import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth/useScaffoldReadContract";

interface CardItem {
  count: string;
  title: string;
}

type item = {
  item: CardItem;
};

const CardItem: React.FC<item> = ({ item }) => (
  <>
    <h3 className="text-2xl md:text-4xl font-black mb-2">{item.count}</h3>
    <h5 className="text-md font-medium opacity-80">{item.title}</h5>
  </>
);

const HeroExpansion: React.FC = () => {
  const currentMember = useAccount();
  const { data: totalAffiliates } = useScaffoldReadContract({
    contractName: "FFFBusiness",
    functionName: "getTotalAffiliatesPerMember",
    args: [currentMember?.address],
  });

  const affiliates = `${Number(totalAffiliates)}`;

  const AffiliatesStats = [
    {
      count: affiliates || "0",
      title: "Tus afiliados",
    },
    {
      count: "0%",
      title: "Crecimiento mensual",
    },
    {
      count: "641",
      title: "P.V",
    },
    {
      count: "313",
      title: "P.V para alcanzar rango",
    },
  ];

  return (
    <section className="mb-8 py-4 bg-white shadow-default rounded-md dark:border-strokedark dark:bg-boxdark text-zinc-900 dark:text-white">
      <div className="container px-4 mx-auto">
        <div className="flex items-center text-center max-w-6xl mx-auto space-x-8">
          <p className="text-base md:text-lg text-gray-600 opacity-80 max-w-4xl mx-auto">
            Puedes dar seguimiento a tu organización, verifica el crecimiento de tus afiliados
          </p>
        </div>
        <div className="z-9 grid grid-cols-12 gap-6 max-w-7xl mx-auto text-center mt-4">
          {AffiliatesStats.map((item, i) => (
            <div className="col-span-3" key={i}>
              <CardItem item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroExpansion;
