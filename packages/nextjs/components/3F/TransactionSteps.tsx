import React, { useEffect, useState } from "react";
import { CheckBadgeIcon, DocumentCheckIcon, DocumentTextIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";
import { TransactionHash } from "~~/app/blockexplorer/_components";

type HeroIcon = React.FC<React.ComponentProps<"svg">>;

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
    {hashes[index] != "" && <TransactionHash hash={hashes[index]} />}
  </div>
);

export const SpecialContentItem = () => (
  <div className="bg-blue-600 shadow-xl rounded-xl flex flex-col justify-center items-center text-center pb-10 px-6 h-full">
    <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center -translate-y-10">
      <h1 className="font-medium text-[40px] dark:text-slate-900">4</h1>
    </div>
    <h2 className="text-white text-2xl font-medium grow">Delivery</h2>
    <p className="text-white leading-relaxed grow opacity-75">
      Your PSD will become a website that works great on all devices like smartphone, laptop, tablet, desktop etc.
    </p>
  </div>
);

export const TransactionSteps = ({
  transactionHash,
  transactionReceiptHash,
  finalTransactionReceiptHash,
  error,
}: {
  transactionHash: string;
  transactionReceiptHash: string;
  finalTransactionReceiptHash: string;
  error: string | undefined;
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (transactionHash && !transactionReceiptHash && !finalTransactionReceiptHash) setProgress(40);
    if (transactionHash && transactionReceiptHash && !finalTransactionReceiptHash) setProgress(70);
    if (transactionHash && transactionReceiptHash && finalTransactionReceiptHash) setProgress(100);
  }, [transactionHash, transactionReceiptHash, finalTransactionReceiptHash]);
  return (
    <section className="ezy__howitworks6 light py-14 md:py-24 bg-transparent text-zinc-900 dark:text-white">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col max-w-xl justify-center items-center text-center mx-auto">
          <h2 className="text-xl font-bold md:text-[45px] mb-4">Transacción en proceso</h2>
          <p className="text-lg opacity-80">Su transacción está siendo aprobada por la cadena de bloques.</p>
        </div>
        <progress className="progress progress-info w-full" value={progress} max="100"></progress>
        <div className="grid grid-cols-4 gap-6 gap-y-16 mt-16 lg:gap-y-0 lg:mt-12">
          {contents.map((item, i) => (
            <div className="col-span-4 sm:col-span-2 lg:col-span-1" key={i}>
              <ContentItem
                item={item}
                index={i}
                hashes={[transactionHash, transactionReceiptHash, "", finalTransactionReceiptHash]}
              />
            </div>
          ))}

          {error && <p>Un erro en el proceso ha ocurrido</p>}
        </div>
      </div>
    </section>
  );
};
