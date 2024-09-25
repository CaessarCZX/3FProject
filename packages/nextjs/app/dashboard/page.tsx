"use client";

import React from "react";
import { useState } from "react";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { IntegerInput } from "~~/components/scaffold-eth";
import { useDateEs } from "~~/hooks/3FProject/useDateEs";
import { useExchangeRatios } from "~~/hooks/3FProject/useExchangeRatios";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { parseCurrency, parseThreeDecimals } from "~~/utils/3FContract/currencyConvertion";

const Dashboard: NextPage = () => {
  const currentAccount = useAccount();
  const [deposit, setDeposit] = useState<string | bigint>("");
  const { exchangeRatio, loadingData } = useExchangeRatios("ETH");
  const currentDate = useDateEs();

  const { data: memberBalance } = useScaffoldReadContract({
    contractName: "FFFBusiness",
    functionName: "getMemberBalance",
    args: [currentAccount?.address ?? ""],
  });

  const { writeContractAsync: depositMemberFunds } = useScaffoldWriteContract("FFFBusiness");

  const handleDeposit = async () => {
    try {
      await depositMemberFunds({
        functionName: "depositMemeberFunds",
        value: BigInt(deposit),
      });
    } catch (e) {
      console.error("Error setting greeting:", e);
    }
  };

  return (
    <>
      <div className=" pt-12 max-w-7xl flex items-center justify-center mx-auto">
        <ul className="grid gap-8 grid-cols-6 grid-rows-2 w-full py-4 sm:px-4">
          <li className="col-span-2 row-span-2">
            <div className="card h-full bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Balance</h2>
                <div className="card-actions flex-col w-full">
                  <article className="flex space-x-2 place-items-baseline">
                    {loadingData ? (
                      <span className="loading loading-dots loading-lg"></span>
                    ) : exchangeRatio && exchangeRatio.USDT ? (
                      <p className="text-4xl font-bold m-0">
                        {parseThreeDecimals(
                          parseCurrency(Number(formatEther(memberBalance || BigInt(0))), Number(exchangeRatio.USDT)),
                        )}
                      </p>
                    ) : (
                      <p className="text-xl font-semibold m-0">Not available</p>
                    )}
                    <span className="text-slate-500">USDT</span>
                  </article>
                  <span className="text-cyan-600 font-light">{`${formatEther(memberBalance || BigInt(0))} ETH`}</span>
                  <p className="text-sm text-slate-500">{currentDate}</p>
                  <div>
                    <span className="font-semibold">Tus referidos</span>
                    <ul className="flex flex-col mt-3">
                      <li>
                        <p className="m-0">3 activos</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className="col-span-4">
            <div className="card card-compact bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Nuevo deposito</h2>
                <div className="card-actions">
                  <div className="flex-grow mr-2">
                    <IntegerInput
                      value={deposit}
                      onChange={updatedDeposit => {
                        setDeposit(updatedDeposit);
                      }}
                      placeholder="value (wei)"
                    />
                    <p>Deposito minimo 25 USDT</p>
                  </div>
                  <div className="space-x-4">
                    <select className="select select-bordered max-w-xs">
                      <option selected>USDT</option>
                      <option disabled>ETH</option>
                    </select>
                    <button className="btn btn-primary px-8" onClick={() => handleDeposit()}>
                      Enviar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className="card card-compact bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Ingresos y egresos</h2>
                <div className="card-actions justify-end"></div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Dashboard;
