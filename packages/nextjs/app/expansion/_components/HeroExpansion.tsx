"use client";

import { useGlobalState } from "~~/services/store/store";

interface CardItem {
  count: string;
  title: string;
}

type CardItemProps = {
  item: CardItem;
};

const CardItemComponent: React.FC<CardItemProps> = ({ item }) => (
  <>
    <h3 className="text-2xl md:text-4xl font-black mb-2">{item.count}</h3>
    <h5 className="text-md font-medium opacity-80">{item.title}</h5>
  </>
);

const HeroExpansion: React.FC = () => {
  const affiliatesNumber = useGlobalState(state => state.memberAffiliates.count);

  const AffiliatesStats = [
    {
      count: affiliatesNumber.toString(),
      title: "Tus afiliados",
    },
    // {
    //   count: "0%",
    //   title: "Crecimiento mensual",
    // },
    // {
    //   count: "641",
    //   title: "P.V",
    // },
    // {
    //   count: "313",
    //   title: "P.V para alcanzar rango",
    // },
  ];

  return (
    <div className="pb-6 col-span-1 flex">
      <section className="w-full py-4 bg-white shadow-default rounded-md dark:border-strokedark dark:bg-boxdark text-zinc-900 dark:text-white">
        <div className="z-9 grid grid-cols-12 text-center mt-4">
          {AffiliatesStats.map((item, i) => (
            <div className="col-span-12" key={i}>
              <CardItemComponent item={item} />
            </div>
          ))}
        </div>
        <p className="mb-1 text-[12px] text-gray-400 font-light text-center">Referidos directos</p>
      </section>
    </div>
  );
};

export default HeroExpansion;
