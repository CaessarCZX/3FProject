"use client";

import React, { useState } from "react";
import MemberFirstDepositButton from "~~/components/Actions/Entrance_member/MemberFirstDepositButton";
import { UsdtInput } from "~~/components/Input/USDT/UsdtInput";

const FirstDepositForm: React.FC = () => {
  const [deposit, setDeposit] = useState("");

  return (
    <article>
      <div className="form-group">
        <div className="input-group flex justify-center relative">
          <div className="min-h-[62px] leading-7 z-10 bg-gray-100 dark:bg-slate-800 focus:outline-none rounded-full ps-1 pe-44 w-full flex items-center border border-gray-300 ">
            <UsdtInput
              classNameBox="border-none shadow-none rounded-full"
              classNameInput="focus:rounded-full focus:border-slate-300"
              value={deposit}
              onChange={amount => setDeposit(amount)}
            />
          </div>
          <MemberFirstDepositButton />
        </div>
      </div>
    </article>
  );
};

export default FirstDepositForm;
