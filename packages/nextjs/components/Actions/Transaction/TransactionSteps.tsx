import React, { useMemo } from "react";
import { CheckBadgeIcon, DocumentCheckIcon, DocumentTextIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";
import { TransactionHash } from "~~/components/Display/TransactionHash";
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
  currentStep: number;
  isComplete: boolean;
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
    text: "En proceso.",
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
    text: "En proceso.",
    stepHash: "",
  },
];

// Componente individual del paso
const FeaturedItem = ({ item, index, currentStep, isComplete, hashes }: ContentItemProps) => {
  const isActive = index === currentStep;

  return (
    <div className="flex justify-between items-center gap-1">
      <div className="flex flex-1">
        {/* Step badge */}
        <div
          className={`min-w-[47px] sm:min-w-[60px] h-12 rounded-xl text-base sm:text-lg flex justify-center items-center mb-0 sm:mb-6 ${
            isComplete ? "bg-green-500 text-white" : "bg-slate-300 text-gray-600"
          }`}
        >
          {isActive && !isComplete ? (
            <span className="loading loading-spinner loading-sm sm:loading-md"></span>
          ) : (
            <h1 className="m-0 font-medium">{index + 1}</h1>
          )}
        </div>
        {/* Textos */}
        <div className="pl-4 text-left">
          <h5 className="text-xs sm:text-lg font-medium">{item.title}</h5>
          <div className="animate-fadeIn">
            {hashes[index] ? (
              <TransactionHash hash={hashes[index]} />
            ) : (
              <p className="text-gray-500 text-[10px] sm:text-base mt-1 font-light leading-snug">
                {isActive ? item.text : ""}
              </p>
            )}
          </div>
        </div>
      </div>
      <div>
        {/* Estado del paso */}
        {isComplete ? (
          <div className="font-medium text-[10px] sm:text-sm bg-green-100 px-2 py-1 rounded-md text-green-600">
            Completo
          </div>
        ) : isActive ? (
          <div className="font-medium text-[10px] sm:text-sm bg-blue-100 px-2 py-1 rounded-md text-blue-700">
            En proceso
          </div>
        ) : (
          <div className="font-medium text-[10px] sm:text-sm bg-gray-100 px-2 py-1 rounded-md text-gray-400">
            Pendiente
          </div>
        )}
      </div>
    </div>
  );
};

// Componente principal
export const TransactionSteps = ({ transaction }: TransactionStepsProps) => {
  const { allowanceHash, allowanceReceiptHash, depositContractHash, depositContractReceiptHash } = transaction;

  const hashByStep = useMemo(
    () => [
      allowanceHash || "",
      allowanceReceiptHash || "",
      depositContractHash || "",
      depositContractReceiptHash || "",
    ],
    [allowanceHash, allowanceReceiptHash, depositContractHash, depositContractReceiptHash],
  );

  const currentStep = useMemo(() => {
    // Identificar el paso actual
    for (let i = 0; i < hashByStep.length; i++) {
      if (!hashByStep[i]) return i;
    }
    return hashByStep.length; // Todos completos
  }, [hashByStep]);

  const progress = useMemo(() => (currentStep / hashByStep.length) * 100, [currentStep, hashByStep.length]);

  return (
    <section className="bg-transparent text-zinc-900 dark:text-white">
      <div className="container sm:px-4 mx-auto">
        <div className="flex flex-col justify-center gap-4 mt-8">
          {contents.map((item, i) => (
            <FeaturedItem
              key={i}
              item={item}
              index={i}
              currentStep={currentStep}
              isComplete={i < currentStep}
              hashes={hashByStep}
            />
          ))}
        </div>
        <progress className="progress progress-info w-full" value={progress} max="100"></progress>
      </div>
    </section>
  );
};
