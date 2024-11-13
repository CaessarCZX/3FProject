import React, { useEffect, useState } from "react";
import { CheckBadgeIcon, DocumentCheckIcon, DocumentTextIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";
import { TransactionHash } from "~~/components/Display/TransactionHash";
import { TransactionInfo } from "~~/utils/3FContract/deposit";

type HeroIcon = React.FC<React.ComponentProps<"svg">>;

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
    title: "Petición de transacción",
    text: "The challenge facing online banks is to meet the needs.",
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
    text: ".",
    stepHash: "",
  },
  {
    icon: CheckBadgeIcon,
    title: "Transacción realizada",
    text: ".",
    stepHash: "",
  },
];

const ContentItem = ({ item, index, hashes }: ContentItemProps) => (
  <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl flex flex-col justify-center items-center text-center pb-10 px-6 h-full">
    <div
      className={`w-16 h-16 rounded-full ${
        !hashes[index] ? "bg-slate-300" : "bg-green-500"
      } bg-opacity-90 flex items-center justify-center -translate-y-10`}
    >
      <h1 className="m-0 font-bold text-[33px] text-white">{index + 1}</h1>
    </div>
    <h2 className="text-2xl font-medium">{item.title}</h2>
    <div className="mt-2">
      <item.icon className="w-[80px] h-[80px]" />
    </div>
    <div className="px-2 py-1 border border-slate-200 flex flex-col justify-center items-center mt-4 gap-1 w-full">
      <p className="m-0">Hash ID</p>
      {hashes[index] == "" ? (
        <span className="loading loading-spinner loading-md bg-green-500"></span>
      ) : (
        <TransactionHash hash={hashes[index]} />
      )}
    </div>
  </div>
);

export const TransactionSteps = (props: TransactionStepsProps) => {
  const [progress, setProgress] = useState(0);
  const { allowanceHash, allowanceReceiptHash, depositContractHash, depositContractReceiptHash, error } =
    props.transaction;
  const hashByStep = [
    allowanceHash || "",
    allowanceReceiptHash || "",
    depositContractHash || "",
    depositContractReceiptHash || "",
    error || "",
  ];

  useEffect(() => {
    if (allowanceHash && !allowanceReceiptHash && !depositContractHash && !depositContractReceiptHash) setProgress(10);
    if (allowanceHash && allowanceReceiptHash && !depositContractHash && !depositContractReceiptHash) setProgress(40);
    if (allowanceHash && allowanceReceiptHash && depositContractHash && !depositContractReceiptHash) setProgress(70);
    if (allowanceHash && allowanceReceiptHash && depositContractHash && depositContractReceiptHash) setProgress(100);
  }, [allowanceHash, allowanceReceiptHash, depositContractReceiptHash, depositContractHash]);
  return (
    <section className="ezy__howitworks6 light py-7 md:py-24 bg-transparent text-zinc-900 dark:text-white">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col max-w-xl justify-center items-center text-center mx-auto">
          <h2 className="text-xl font-bold md:text-[45px] mb-4">Transacción en proceso</h2>
          <p className="text-lg opacity-80">Su transacción está siendo aprobada por la cadena de bloques.</p>
        </div>
        <progress className="progress progress-info w-full" value={progress} max="100"></progress>
        <div className="grid grid-cols-4 gap-6 gap-y-16 mt-16 lg:gap-y-0 lg:mt-12">
          {contents.map((item, i) => (
            <div className="col-span-4 sm:col-span-2 lg:col-span-1" key={i}>
              <ContentItem item={item} index={i} hashes={hashByStep} />
            </div>
          ))}

          {error && <p>Un erro en el proceso ha ocurrido</p>}
        </div>
      </div>
    </section>
  );
};
