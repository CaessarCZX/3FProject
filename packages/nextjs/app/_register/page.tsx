"use client";

import { useState } from "react";
import Image from "next/image";
import userIcon from "../../public/userIcon.svg";
import type { NextPage } from "next";
import MemberEntranceButton from "~~/components/Actions/Entrance_member/_MemberEntranceButton";
import { UsdtInput } from "~~/components/Input/USDT/UsdtInput";
import { AddressInput } from "~~/components/scaffold-eth";

const defaultAddress = process.env.NEXT_PUBLIC_FIRST_CONTRACT_MEMBER || "0x";

const Register: NextPage = () => {
  // const { address: connectedAddress } = useAccount();
  const [address, setAddress] = useState("");
  const [deposit, setDeposit] = useState("");
  const [hasUpline, setHasUpline] = useState(true);
  // const router = useRouter();

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
                <div className="w-full">
                  {hasUpline && (
                    <span>
                      <p className="text-xs font-thin text-slate-400 flex self-start ml-3 mb-2">
                        Eres referido de alguien?
                      </p>
                      <AddressInput
                        onChange={setAddress}
                        value={address}
                        placeholder="Pon la dirección de tu Upline"
                        disabled={!hasUpline}
                      />
                    </span>
                  )}
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="text-xs font-thin text-slate-400 m-0 ml-3">No tengo un upline</span>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary checkbox-xs"
                        onChange={() => setHasUpline(!hasUpline)}
                      />
                    </label>
                  </div>

                  <div className="flex-grow pt-4">
                    <UsdtInput value={deposit} onChange={amount => setDeposit(amount)} />
                    <p className="mb-2 text-xs font-light text-slate-600">Deposito minimo de 2000 USDT</p>
                  </div>
                </div>
                <MemberEntranceButton
                  uplineAddress={!hasUpline ? defaultAddress : address}
                  depositAmount={deposit}
                  btnText="Entrar"
                />
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default Register;
