/* eslint-disable @next/next/no-img-element */
import React from "react";
import FirstDepositForm from "./FirstDepositForm";

const Shapes = () => (
  <>
    <svg
      className="absolute bottom-72 right-[2%] -z-10 md:right-24 text-[#FFFBEF] dark:text-slate-800 dark:text-opacity-30"
      width="104"
      height="104"
      viewBox="0 0 104 104"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="52" cy="52" r="52" fill="currentColor" />
    </svg>

    <svg
      className="absolute bottom-0 right-1/2 translate-x-1/2 md:right-12 md:translate-x-0 text-[#FFFBEF] dark:text-slate-800 dark:text-opacity-30 -z-10"
      width="710"
      height="458"
      viewBox="0 0 710 458"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="355" cy="355" r="355" fill="currentColor" />
      <defs>
        <linearGradient id="paint0_linear_1_4250" x1="355" y1="0" x2="355" y2="710" gradientUnits="userSpaceOnUse">
          <stop stopColor="#303741" />
          <stop offset="1" stopColor="#0E1115" />
        </linearGradient>
      </defs>
    </svg>
  </>
);

const FirstDepositScreen: React.FC = () => {
  return (
    <section className="bg-white dark:bg-[#0b1727] text-zinc-900 dark:text-white relative overflow-hidden z-10">
      <div className="container mx-auto px-4">
        <div>
          <img
            className="absolute bottom-0 right-16 hidden opacity-30 saturate-0 xl:opacity-100 sm:block md:max-h-full h-auto"
            src="https://cdn.easyfrontend.com/pictures/hero/hero_27.png"
            alt=""
          />
        </div>
        <Shapes />

        <div className="grid grid-cols-12 gap-y-6 gap-x-6 text-center md:text-start max-w-7xl">
          <div className="col-span-12 md:col-span-8 lg:col-span-7">
            <div className="py-18 px-12 relative">
              <h1 className="text-3xl font-bold leading-[1.1] mb-2 md:text-[62px] md:min-w-[409px]">
                Podrias estar recibiendo tus comisiones el siguiente mes, ehh?
              </h1>
              <p className="text-[22px] leading-snug opacity-80 my-6 md:max-w-95">
                Inicia tu primer deposito y comienza a ahorrar con nosotros.
              </p>
              <div>
                <FirstDepositForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FirstDepositScreen;
