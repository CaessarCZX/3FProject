"use client";

import React, { useState } from "react";
import DepositDashboardButton from "./DepositDashboardButton";
import FirstDepositDashboardButton from "./FirstDepositDashboardButton";
import { TbPigMoney } from "react-icons/tb";
import { useAccount } from "wagmi";
import { UsdtInput } from "~~/components/Input/USDT/UsdtInput";
import CardBox from "~~/components/UI/CardBox";
import DepositReference from "~~/components/UI/DepositReference";
import { useGetMemberStatus } from "~~/hooks/user/useGetMemberStatus";

const DepositContract: React.FC = () => {
  const { memberStatus } = useGetMemberStatus();
  const currentAccount = useAccount();
  const [deposit, setDeposit] = useState("");
  return (
    <CardBox className="col-span-2 md:col-span-3 lg:col-span-3">
      <div className="flex items-center space-x-4 mb-4">
        {/* For Icon */}
        <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          <TbPigMoney className="w-6 h-6 text-brand-default dark:text-white" />
        </div>
        {/* For Icon */}

        {/* For title */}
        <h3 className="font-light text-3xl text-gray-500 dark:text-slate-100">
          {currentAccount.isDisconnected
            ? "Conecta una wallet"
            : memberStatus
            ? "Nuevo Ahorro"
            : "Inicia tu primer ahorro"}
        </h3>
        {/* For title */}
      </div>

      {/* Input for savings */}
      {currentAccount.isDisconnected ? (
        <article className="flex justify-center w-full">
          <p className="text-lg m-0 text-gray-300 dark:text-gray-500">Conecta tu wallet y continua ahorrando</p>
        </article>
      ) : (
        <article className=" w-full">
          <div className="flex flex-col sm:flex-row gap-4">
            <UsdtInput value={deposit} onChange={amount => setDeposit(amount)} />
            {memberStatus ? (
              <DepositDashboardButton depositAmount={deposit} />
            ) : (
              <FirstDepositDashboardButton depositAmount={deposit} />
            )}
          </div>
          <div className="text-gray-400">
            <DepositReference isNormalDeposit={memberStatus} />
          </div>
        </article>
      )}
      {/* Input for savings */}
    </CardBox>
  );
};

export default DepositContract;
