"use client";

import React from "react";
import { useState } from "react";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { IntegerInput } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const Dashboard: NextPage = () => {
  const currentAccount = useAccount();
  const [deposit, setDeposit] = useState<string | bigint>("");

  const { data: memberBalance } = useScaffoldReadContract({
    contractName: "FFFBusiness",
    functionName: "getMemberBalance",
    args: [currentAccount?.address ?? ""],
  });

  return (
    <>
      <div className=" pt-12 max-w-7xl flex items-center justify-center mx-auto">
        <ul className="grid gap-8 grid-cols-2 w-full">
          <li className="col-span-1 row-span-2">
            <div className="card h-full bg-base-100 w-96 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Balance</h2>
                <div className="card-actions flex-col w-full">
                  <article className="flex space-x-2 place-items-baseline">
                    <p className="text-4xl font-bold m-0">$200</p>
                    <span className="text-slate-500">USDT</span>
                  </article>
                  <span className="text-cyan-600 font-light">{`${formatEther(memberBalance || BigInt(0))} ETH`}</span>
                  <p className="text-sm text-slate-500">23 septiembre del 2024</p>
                  <div>
                    <span className="font-semibold">Tus referidos</span>
                    <ul className="flex flex-col mt-3">
                      <li>
                        <p className="m-0">0x0047jwhd9ye9ruq30ifq039yu034u93u8</p>
                        <p className="m-0">0x0047jwhd9ye9ruq30ifq039yu034u93u8</p>
                        <p className="m-0">0x0047jwhd9ye9ruq30ifq039yu034u93u8</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className="card card-compact bg-base-100 w-96 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Nuevo deposito</h2>
                <div className="card-actions">
                  <IntegerInput
                    value={deposit}
                    onChange={updatedDeposit => {
                      setDeposit(updatedDeposit);
                    }}
                    placeholder="value (wei)"
                  />
                  <select className="select select-bordered max-w-xs">
                    <option disabled selected>
                      Who shot first?
                    </option>
                    <option>Han Solo</option>
                    <option>Greedo</option>
                  </select>

                  <button className="btn btn-primary">Buy Now</button>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className="card card-compact bg-base-100 w-96 shadow-xl">
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
