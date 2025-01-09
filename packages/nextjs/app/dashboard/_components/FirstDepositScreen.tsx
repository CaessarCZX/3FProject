/* eslint-disable @next/next/no-img-element */
import React from "react";
import Image from "next/image";
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
    <>
      <section className="bg-white dark:bg-[#0b1727] shadow-default text-zinc-900 dark:text-white relative overflow-hidden z-10">
        <div className="container mx-auto pl-4">
          <Shapes />
          <div className="flex text-center md:text-start max-w-7xl">
            <div className="py-18 px-12">
              <h1 className="text-3xl font-bold leading-[1.1] mb-2 md:text-[47px]">
                Gracias por ser parte de Friends & Family
              </h1>
              <p className="text-[22px] leading-snug opacity-80 my-6 md:max-w-95">Inicia tu primer ahorro.</p>
              <div>
                <FirstDepositForm />
              </div>
            </div>
            <div>
              <Image
                className="hidden md:block md:min-w-[375px]"
                width={400}
                height={400}
                src="/vision-images/7.png"
                alt="vision friends and family"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white dark:bg-[#0b1727] shadow-default text-zinc-900 dark:text-white overflow-hidden mt-8">
        <div className="p-18">
          <h2 className="text-3xl md:text-[40px] font-bold">Compartir la riqueza es nuestro valor</h2>
          <article className="mt-10 font-light text-base text-justify">
            <p>
              Somos parte de un ecosistema cerrado donde colaboramos con una organización global de traders como
              aliados, quienes con su metodología, estrategia y tecnología en los criptomercados han sostenido un
              crecimiento positivo de forma histórica durante más de 5 años.
            </p>
            <p className="mb-0">
              Buscamos servir únicamente a nuestros amigos y familiares cercanos que desean apoyarse de instrumentos
              para acrecentar su economía en un modelo confiable donde convivimos con el riesgo de forma estudiada y se
              toman las mejores oportunidades. Nuestra visión de servicio a un grupo cercano de amigos y familia hace
              que la organización esté acotada a únicamente 10 millones de USDT de la cual eres parte. Habría espacio
              para un miembro nuevo, al momento de un retiro definitivo de una aportación.
            </p>
            <p className="m-0">
              Nuestros valores son la transparencia, repartición de la riqueza, conocimiento y honorabilidad.
            </p>
            <p className="m-0">
              Nuestros valores son la transparencia, repartición de la riqueza, conocimiento y honorabilidad. Free
              Friends and Family, la abundancia representa las posibilidades y significados que existen detrás de ella,
              como familias unidas, la capacidad de afrontar un imprevisto, planificar vacaciones, un negocio, estudios
              escolares, diversificar ingresos, es decir, abundancia con propósito.
            </p>
            <p className="m-0">¡Deseamos que esto lo puedas vivir!</p>
            <div className="mt-12">
              <div className="text-base font-bold">Atentamente</div>
              <p className="m-0">Friends and Family</p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
};

export default FirstDepositScreen;
