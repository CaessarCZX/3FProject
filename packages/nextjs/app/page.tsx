"use client";

import Image from "next/image";
import type { NextPage } from "next";
import { SubscribeForm } from "~~/components/Actions/Email";
import logo_white from "~~/public/logo/logo_white.svg";

const Home: NextPage = () => {
  return (
    <>
      <header
        className="min-h-screen text-white bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: "url(https://cdn.easyfrontend.com/pictures/contact/contact13.jpg)",
        }}
      >
        {/* For background */}
        <div
          className="absolute top-0 left-0 right-0 bottom-0 opacity-80"
          style={{
            // backgroundImage: "linear-gradient(145deg, #9013fe 0%, #101a8e 100%)",
            backgroundImage: "linear-gradient(145deg, #3e4946 0%, #7b8f93 100%)",
          }}
        ></div>
        {/* For background */}

        {/* Main container */}
        <div className="container px-4 pt-16 mt-32 md:pt-8 relative m-auto">
          <div className="grid grid-cols-12">
            <div className="col-span-12 text-center">
              <picture className="w-full mb-8 block">
                <Image className="m-auto w-[120px] md:w-[150px]" src={logo_white} alt="FREE Friends and Family" />
                <h3 className="font-regular leading-none text-5xl md:text-7xl tracking-widest mt-2 mb-0">FREE</h3>
                <p className="m-0 p-0 font-light tracking-widest text-xs md:text-lg">FRIENDS & FAMILY</p>
              </picture>

              <h2 className="text-3xl leading-none md:text-[57px] font-bold mb-6">Bienvenido a la familia!</h2>
              <div className="flex w-full items-center justify-center mt-4">
                <SubscribeForm />
              </div>
              <p className="mt-6 font-light text-xs">* Solo miembros aprobados</p>
            </div>
          </div>
        </div>
        {/* Main container */}
      </header>
    </>
  );
};

export default Home;
