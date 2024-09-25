"use client";

import { useState } from "react";
import Image from "next/image";
// import Link from "next/link";
import userIcon from "../../public/userIcon.svg";
import type { NextPage } from "next";
import { AddressInput } from "~~/components/scaffold-eth";

// import { useAccount } from "wagmi";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  // const { address: connectedAddress } = useAccount();
  const [address, setAddress] = useState("");

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
              <p className="mt-2 mb-1 leading-none">Bienvenido a la comunidad descentralizada</p>
              <div className="card-actions">
                <p>Eres referido de alguien?</p>
                <AddressInput onChange={setAddress} value={address} placeholder="Input your address" />
                <button className="btn btn-primary">Acceder</button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default Home;
