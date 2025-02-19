"use client";

import React, { useState } from "react";
import CommonDepositButton from "./CommonDepositButton";
import FirstDepositButton from "./FirstDepositButton";
import { UsdtInput } from "~~/components/Input/USDT/UsdtInput";
import DepositReference from "~~/components/UI/DepositReference";

const DepositForm: React.FC<{ memberStatus: boolean | null }> = ({ memberStatus }) => {
  const [deposit, setDeposit] = useState("");

  return (
    <>
      {/* Web Design */}
      <article className="hidden sm:block">
        <div className="form-group">
          <div className="input-group flex justify-center relative max-w-[750px]">
            <div className="min-h-[62px] leading-7 z-10 bg-gray-100 dark:bg-slate-800 focus:outline-none rounded-full ps-1 pe-44 w-full flex items-center border border-gray-300">
              <UsdtInput
                classNameBox="border-none shadow-none rounded-full"
                classNameInput="focus:rounded-full focus:border-slate-300"
                value={deposit}
                onChange={amount => setDeposit(amount)}
              />
            </div>
            {!memberStatus ? (
              <FirstDepositButton depositAmount={deposit} />
            ) : (
              <CommonDepositButton depositAmount={deposit} />
            )}
          </div>
          <div className="ml-6 text-gray-500 lg:text-gray-400">
            <DepositReference isNormalDeposit={memberStatus} />
          </div>
        </div>
      </article>

      {/* Mobile Design */}
      <article className="sm:hidden">
        <div className="form-group">
          <div className="input-group flex flex-col sm:flex-row justify-center items-center relative w-full">
            <div className="min-h-[62px] leading-7 z-10 bg-gray-100 dark:bg-slate-800 focus:outline-none rounded-full ps-1 sm:pe-44 w-full sm:w-auto flex items-center border border-gray-300 sm:mb-0">
              <UsdtInput
                classNameBox="border-none shadow-none rounded-full"
                classNameInput="focus:rounded-full focus:border-slate-300"
                value={deposit}
                onChange={amount => setDeposit(amount)}
              />
            </div>
            <div className="w-full sm:w-auto flex justify-center">
              {!memberStatus ? (
                <FirstDepositButton depositAmount={deposit} />
              ) : (
                <CommonDepositButton depositAmount={deposit} />
              )}
            </div>
            <div className="mt-1 text-gray-500 lg:text-gray-400">
              <DepositReference isNormalDeposit={memberStatus} />
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default DepositForm;
