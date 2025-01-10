"use client";

import React, { useState } from "react";
import MemberFirstDepositButton from "~~/components/Actions/Entrance_member/MemberFirstDepositButton";
import { UsdtInput } from "~~/components/Input/USDT/UsdtInput";

const FirstDepositForm: React.FC = () => {
  const [deposit, setDeposit] = useState("");

  return (
    <>
      {/* Web Design */}
      <article className="hidden sm:block">
        <div className="form-group">
          <div className="input-group flex justify-center relative">
            <div className="min-h-[62px] leading-7 z-10 bg-gray-100 dark:bg-slate-800 focus:outline-none rounded-full ps-1 pe-44 w-full flex items-center border border-gray-300">
              <UsdtInput
                classNameBox="border-none shadow-none rounded-full"
                classNameInput="focus:rounded-full focus:border-slate-300"
                value={deposit}
                onChange={amount => setDeposit(amount)}
              />
            </div>
            <MemberFirstDepositButton depositAmount={deposit} />
          </div>
        </div>
      </article>

      {/* Mobile Design */}
      <article className="sm:hidden">
        <div className="form-group">
          <div className="input-group flex flex-col sm:flex-row justify-center items-center relative w-full">
            <div className="min-h-[62px] leading-7 z-10 bg-gray-100 dark:bg-slate-800 focus:outline-none rounded-full ps-1 sm:pe-44 w-full sm:w-auto flex items-center border border-gray-300 mb-12 sm:mb-0">
              <UsdtInput
                classNameBox="border-none shadow-none rounded-full"
                classNameInput="focus:rounded-full focus:border-slate-300"
                value={deposit}
                onChange={amount => setDeposit(amount)}
              />
            </div>
            <div className="mt-0 w-full sm:w-auto flex justify-center px-4">
              <MemberFirstDepositButton depositAmount={deposit} />
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default FirstDepositForm;
