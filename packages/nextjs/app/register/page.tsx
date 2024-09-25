"use client";

import { useState } from "react";
import Image from "next/image";
// import Link from "next/link";
import userIcon from "../../public/userIcon.svg";
import type { NextPage } from "next";
import { AddressInput } from "~~/components/scaffold-eth";
import { IntegerInput } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

// import { useAccount } from "wagmi";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  // const { address: connectedAddress } = useAccount();
  const [address, setAddress] = useState("");
  const [deposit, setDeposit] = useState<string | bigint>("");

  const { writeContractAsync: memberEntrance } = useScaffoldWriteContract("FFFBusiness");

  const handleMemberEntrance = async () => {
    try {
      // IMPORTANT: THIS ADDRES IS JUST PROVISIONAL DEVELOPMENT
      if (address == null) setAddress("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");

      await memberEntrance({
        functionName: "memberEntrance",
        args: [address],
        value: BigInt(deposit),
      });
    } catch (e) {
      console.error("Error setting greeting:", e);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center flex-col flex-grow pt-10">
        <article>
          <div className="card bg-base-100 w-96 shadow-xl">
            <figure className="px-10 pt-10">
              <Image src={userIcon} alt="user icon" className="rounded-xl" />
            </figure>
            <div className="card-body items-center text-center pt-1  px-8">
              <h2 className="card-title m-0">Bienvenido!!</h2>
              <p className="mt-2 mb-1 leading-none font-light">Bienvenido a la comunidad descentralizada</p>
              <div className="card-actions flex-col w-full">
                <p className="text-xs font-thin text-slate-400 m-0 ml-3">Eres referido de alguien?</p>
                <div className="w-full">
                  <AddressInput onChange={setAddress} value={address} placeholder="Pon la dirección de tu Upline" />
                  <div className="flex-grow mt-4">
                    <IntegerInput
                      value={deposit}
                      onChange={updatedDeposit => {
                        setDeposit(updatedDeposit);
                      }}
                      placeholder="¿Con cuanto ingresaras?"
                    />
                    <p className="text-xs font-thin text-slate-400 m-0 ml-3">Deposito minimo 25 USDT</p>
                  </div>
                </div>
                <button
                  disabled={!deposit ? true : false}
                  className="btn btn-primary self-end w-full"
                  onClick={() => handleMemberEntrance()}
                >
                  Acceder
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default Home;
