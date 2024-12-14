import React, { useEffect, useState } from "react";
import { CheckBadgeIcon, DocumentCheckIcon, DocumentTextIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";
// import { TransactionHash } from "~~/components/Display/TransactionHash";
import { HeroIcon } from "~~/types/heroicon";
import { TransactionInfo } from "~~/utils/3FContract/deposit";

interface TransactionStepsProps {
  description: string;
  transaction: TransactionInfo;
}

type StepItem = {
  icon: HeroIcon;
  title: string;
  text: string;
  stepHash: string | undefined;
};

type ContentItemProps = {
  item: StepItem;
  index: number;
  hashes: string[];
};

const contents: StepItem[] = [
  {
    icon: DocumentTextIcon,
    title: "Solicitando permiso para mover tokens",
    text: "Accion necesaria en la wallet.",
    stepHash: "",
  },
  {
    icon: HandThumbUpIcon,
    title: "Estimando Transacción",
    text: ".",
    stepHash: "",
  },
  {
    icon: DocumentCheckIcon,
    title: "Confirmar y pagar",
    text: "Accion necesaria en la wallet",
    stepHash: "",
  },
  {
    icon: CheckBadgeIcon,
    title: "Transacción realizada",
    text: ".",
    stepHash: "",
  },
];

// const ContentItem = ({ item, index, hashes }: ContentItemProps) => (
//   <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl flex flex-col justify-center items-center text-center pb-10 px-6 h-full">
//     <div
//       className={`w-16 h-16 rounded-full transition-colors ${
//         !hashes[index] ? "bg-slate-300" : "bg-green-500"
//       } bg-opacity-90 flex items-center justify-center -translate-y-10`}
//     >
//       <h1 className="m-0 font-bold text-[33px] text-white">{index + 1}</h1>
//     </div>
//     <h2 className="text-lg font-medium">{item.title}</h2>
//     <div className="mt-2">
//       <item.icon className="w-[50px] h-[50px]" />
//     </div>
//     <div className="px-2 py-1 border border-slate-200 flex flex-col justify-center items-center mt-4 gap-1 w-full">
//       <p className="m-0">Hash ID</p>
//       {hashes[index] == "" ? (
//         <span className="loading loading-spinner loading-md bg-green-500"></span>
//       ) : (
//         <TransactionHash hash={hashes[index]} />
//       )}
//     </div>
//   </div>
// );

const FeaturedItem = ({ item, index, hashes }: ContentItemProps) => {
  return (
    <div className="flex justify-between">
      <div className="flex">
        {/* Step badge */}
        <div
          className={`${
            !hashes[index] ? "bg-slate-300" : "bg-green-500"
          } text-white min-w-[60px] h-12 rounded-xl text-lg flex justify-center items-center mb-6`}
        >
          {hashes[index - 1] !== undefined ? (
            <h1 className="m-0 font-normal text-xl text-white">{index + 1}</h1>
          ) : (
            <span className="loading loading-spinner loading-md bg-green-white"></span>
          )}
        </div>
        {/* Step badge */}
        <div className="pl-4">
          <h5 className="text-lg font-medium">{item.title}</h5>
          <p className="text-gray-500 text-base mt-1 font-light leading-snug">{item.text}</p>
        </div>
      </div>
      <div>
        {/* For badges */}
        {hashes[index] == "" ? (
          <div className="font-medium text-sm bg-slate-200 px-2 py-1 rounded-md text-gray-500">En proceso</div>
        ) : (
          <div className="font-medium text-sm bg-green-100 px-2 py-1 rounded-md text-green-600">Completo</div>
        )}
        {/* For badges */}
      </div>
    </div>
  );
};

export const TransactionSteps = (props: TransactionStepsProps) => {
  const [progress, setProgress] = useState(0);
  const { allowanceHash, allowanceReceiptHash, depositContractHash, depositContractReceiptHash } = props.transaction;
  const hashByStep = [
    allowanceHash || "",
    allowanceReceiptHash || "",
    depositContractHash || "",
    depositContractReceiptHash || "",
  ];

  useEffect(() => {
    if (allowanceHash && !allowanceReceiptHash && !depositContractHash && !depositContractReceiptHash) setProgress(10);
    if (allowanceHash && allowanceReceiptHash && !depositContractHash && !depositContractReceiptHash) setProgress(40);
    if (allowanceHash && allowanceReceiptHash && depositContractHash && !depositContractReceiptHash) setProgress(70);
    if (allowanceHash && allowanceReceiptHash && depositContractHash && depositContractReceiptHash) setProgress(100);
  }, [allowanceHash, allowanceReceiptHash, depositContractReceiptHash, depositContractHash]);
  return (
    <section className="bg-transparent text-zinc-900 dark:text-white">
      <div className="container px-4 mx-auto">
        {/* <div className="grid grid-cols-2"> */}
        <div className="flex flex-col justify-center gap-4 xl:mr-20 mt-8">
          {contents.map((item, i) => (
            <FeaturedItem key={i} item={item} index={i} hashes={hashByStep} />
          ))}
        </div>
        <progress className="progress progress-info w-full" value={progress} max="100"></progress>
      </div>
    </section>
  );
};
// lg:gap-y-0 lg:mt-12
{
  /* <div className="col-span-4 sm:col-span-2 lg:col-span-1" key={i}>
       <ContentItem item={item} index={i} hashes={hashByStep} /> 
    </div> */
}
