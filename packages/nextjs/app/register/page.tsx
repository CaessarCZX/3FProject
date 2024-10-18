"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
// import Link from "next/link";
import userIcon from "../../public/userIcon.svg";
import { writeContract } from "@wagmi/core";
import type { NextPage } from "next";
import { erc20Abi } from "viem";
import { UsdtInput } from "~~/components/3F/UsdtInput";
import { AddressInput } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

const tokenUsdt = process.env.NEXT_PUBLIC_TEST_TOKEN_ADDRESS_FUSDT ?? "0x";

const Register: NextPage = () => {
  // const { address: connectedAddress } = useAccount();
  const [address, setAddress] = useState("");
  const [deposit, setDeposit] = useState("");
  const router = useRouter();

  const { data: contract } = useDeployedContractInfo("FFFBusiness");
  const { writeContractAsync: memberEntrance } = useScaffoldWriteContract("FFFBusiness");

  const handleMemberEntrance = async () => {
    try {
      // IMPORTANT: THIS ADDRES IS JUST PROVISIONAL DEVELOPMENT
      if (address == null) setAddress("");
      if (!contract?.address) {
        console.error("Direccion del contrato no encontrada");
        return;
      }

      const contractAddress = contract?.address ?? "0x";
      const convertDeposit = Math.round(Number(deposit) * 10 ** 6);
      const allowanceAmount = BigInt(convertDeposit);

      // Allowance for transaction
      const approveTx = await writeContract(wagmiConfig, {
        abi: erc20Abi,
        address: tokenUsdt,
        functionName: "approve",
        args: [contractAddress, allowanceAmount],
      });

      if (approveTx) {
        await memberEntrance({
          functionName: "memberEntrance",
          args: [address, allowanceAmount],
        });
      }

      router.push("/dashboard");
    } catch (e) {
      console.error("Error", e);
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
                  <div className="flex-grow pt-4">
                    <UsdtInput value={deposit} onChange={amount => setDeposit(amount)} />
                    <p className="mb-2 text-xs font-light text-slate-600">Deposito minimo de 2000 USDT</p>
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

export default Register;
