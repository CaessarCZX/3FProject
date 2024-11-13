"use client";

import React from "react";
import { useEffect, useState } from "react";
import BlockExplorer from "./_components/BlockExplorer";
import type { NextPage } from "next";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import DepositButton from "~~/components/Actions/Deposit/DepositButton";
import { UsdtInput } from "~~/components/Input/USDT/UsdtInput";
import { useDateEs } from "~~/hooks/3FProject/useDateEs";
import { useExchangeRatios } from "~~/hooks/3FProject/useExchangeRatios";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { formatCurrency, parseCurrency, parseThreeDecimals } from "~~/utils/3FContract/currencyConvertion";

// import ProtectedRoute from "~~/services/Auth/ProtectedRoute";

const Dashboard: NextPage = () => {
  const currentMember = useAccount();
  const [deposit, setDeposit] = useState("");
  const [currencyType, setCurrencyType] = useState<string>("USDT");
  const { exchangeRatio, loadingData } = useExchangeRatios("ETH");
  const { exchangeRatio: exchangeUSD, loadingData: loadingUSD } = useExchangeRatios("USD");
  const [dollarBalance, setDollarBalance] = useState(0);
  const currentDate = useDateEs();

  const { data: memberBalance } = useScaffoldReadContract({
    contractName: "FFFBusiness",
    functionName: "getMemberBalance",
    args: [currentMember?.address],
  });

  const { data: totalAffiliates } = useScaffoldReadContract({
    contractName: "FFFBusiness",
    functionName: "getTotalAffiliatesPerMember",
    args: [currentMember?.address],
  });

  useEffect(() => {
    if (!loadingData && exchangeRatio?.USDT) {
      const currentDollarBalance = Number(formatUnits(BigInt(memberBalance || 0), 6));
      setDollarBalance(currentDollarBalance);
    }
  }, [loadingData, exchangeRatio, memberBalance]);

  return (
    <>
      <div className="max-w-7xl w-full flex items-center justify-center mx-auto px-4">
        <ul className="grid w-full gap-8 grid-cols-1 grid-rows-[1fr_225px_1fr] sm:px-4 md:grid-cols-6 md:grid-rows-[150px_1fr] md:pt-8 lg:max-h-[800px]">
          <li className="col-span-4 md:col-span-2 md:row-span-2">
            <div className="card h-full bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Balance</h2>
                <div className="card-actions flex-col w-full">
                  <article className="flex space-x-2 place-items-baseline">
                    {loadingData ? (
                      <span className="loading loading-dots loading-lg"></span>
                    ) : exchangeRatio && exchangeRatio.USDT ? (
                      <p className="text-4xl font-bold m-0">{formatCurrency(dollarBalance)}</p>
                    ) : (
                      <p className="text-xl font-semibold m-0">No disponible</p>
                    )}
                    <span className="text-slate-500">USDT</span>
                  </article>
                  <span>
                    {loadingUSD ? (
                      <span className="loading loading-spinner text-accent"></span>
                    ) : exchangeUSD && exchangeUSD.MXN && dollarBalance ? (
                      <span className="text-cyan-600 font-light">
                        {`${formatCurrency(
                          parseThreeDecimals(parseCurrency(dollarBalance, Number(exchangeUSD.MXN))),
                        )} MXN`}
                      </span>
                    ) : (
                      <p className="text-xl font-semibold m-0">No disponible</p>
                    )}
                  </span>
                  <p className="text-sm text-slate-500">{currentDate}</p>
                  <div className="w-full">
                    <span className="font-semibold ml-2 text-slate-800">Tus referidos</span>
                    <ul className="flex mt-3">
                      <button className="btn justify-between w-full">
                        <UserGroupIcon className="w-6 h-6" />
                        <div className="flex gap-2 items-center">
                          Activos
                          <div
                            className={`badge badge-secondary py-3 text-white px-4 ${
                              totalAffiliates != undefined && totalAffiliates > 0
                                ? "bg-gradient-to-b from-cyan-500 to-blue-500"
                                : "bg-gradient-to-b from-red-600 to-red-950"
                            }`}
                          >
                            {totalAffiliates == null ? (
                              <span className="loading loading-bars loading-xs"></span>
                            ) : (
                              <p>{Number(totalAffiliates)}</p>
                            )}
                          </div>
                        </div>
                      </button>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className="col-span-4 md:row-span-1">
            <div className="card card-compact h-full bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title ml-2">Nuevos ahorros</h2>
                <div className="card-actions">
                  <div className="flex-grow mx-2">
                    <UsdtInput value={deposit} onChange={amount => setDeposit(amount)} />
                    <p className="mb-2 text-xs font-light text-slate-600">Deposito minimo 2000 USDT</p>
                  </div>
                  <div className="w-full space-x-4 flex justify-end  md:w-auto lg:self-auto">
                    <select
                      value={currencyType}
                      onChange={e => setCurrencyType(e.target.value)}
                      className="select select-bordered max-w-xs"
                    >
                      <option value="USDT">USDT</option>
                      <option value="ETH" disabled>
                        ETH
                      </option>
                    </select>
                    <DepositButton depositAmount={deposit} btnText="Preparar deposito" />
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className="col-span-4 max-h-[300px]">
            <div className="card card-compact h-full bg-base-100 shadow-xl">
              <div className="card-body flex-none">
                <h2 className="card-title">Mis ahorros</h2>
                <div className="card-actions">
                  <BlockExplorer />
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Dashboard;
