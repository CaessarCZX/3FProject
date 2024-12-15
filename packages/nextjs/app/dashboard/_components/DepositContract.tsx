"use client";

import React, { useState } from "react";
import { TbPigMoney } from "react-icons/tb";
import DepositButton from "~~/components/Actions/Deposit/DepositButton";
import MemberEntranceButton from "~~/components/Actions/Entrance_member/MemberEntranceButton";
import { UsdtInput } from "~~/components/Input/USDT/UsdtInput";
import CardBox from "~~/components/UI/CardBox";

const DepositContract: React.FC = () => {
  const [deposit, setDeposit] = useState("");
  return (
    <CardBox className="col-span-1 md:col-span-2">
      <div className="flex items-center space-x-4 mb-4">
        {/* For Icon */}
        <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          <TbPigMoney className="w-6 h-6 text-primary dark:text-white" />
        </div>
        {/* For Icon */}

        {/* For title */}
        <h3 className="font-light text-3xl text-gray-500 dark:text-slate-100">Nuevo Ahorro</h3>
        {/* For title */}
      </div>

      {/* Input for savings */}
      <article className="flex space-x-4 w-full">
        <UsdtInput value={deposit} onChange={amount => setDeposit(amount)} />
        <MemberEntranceButton
          uplineAddress="0x2C286498a497dA07cAa975ad435b0fD047F7C6aE"
          depositAmount={deposit}
          btnText="test"
        />
        <DepositButton depositAmount={deposit} btnText="Depositar" />
      </article>
      {/* Input for savings */}
    </CardBox>
  );
};

export default DepositContract;
