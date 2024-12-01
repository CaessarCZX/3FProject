"use client";

import React, { useState } from "react";
import { TbPigMoney } from "react-icons/tb";
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
        <h3 className="font-bold text-xl">Nuevo Ahorro</h3>
        {/* For title */}
      </div>
      <UsdtInput value={deposit} onChange={amount => setDeposit(amount)} />
    </CardBox>
  );
};

export default DepositContract;
