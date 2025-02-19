import React from "react";
import Image from "next/image";
import DepositForm from "./DepositForm";
import Shapes from "./Shapes";
import { useGetMemberStatus } from "~~/hooks/user/useGetMemberStatus";

const HeroHome: React.FC = () => {
  const { memberStatus } = useGetMemberStatus();
  return (
    <>
      <section className="bg-white dark:bg-[#0b1727] shadow-default text-zinc-900 dark:text-white relative overflow-hidden z-10">
        <div className="mx-auto">
          <div className="flex text-center md:text-start">
            <div className="py-18 px-12 w-full">
              <Shapes />
              <h1 className="text-3xl font-bold leading-[1.1] mb-2 md:text-[37px]">
                Gracias por ser parte de Friends & Family
              </h1>
              <p className="text-[22px] leading-snug opacity-80 my-6 md:max-w-95">
                {!memberStatus ? "Inicia tu primer ahorro." : "Inicia un nuevo ahorro."}
              </p>
              <div>
                <DepositForm memberStatus={memberStatus} />
              </div>
            </div>
            <div>
              <Image
                className="hidden xl:block md:min-w-[375px] contrast-75 dark:grayscale dark:contrast-50"
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
        <div className="p-10 xsm:p-12 sm:p-15 xl:p-18">
          <h2 className="text-3xl md:text-[40px] font-bold">Compartir la riqueza es nuestro valor</h2>
          <article className="mt-10 font-normal text-brand-hover dark:text-gray-400 text-base text-justify">
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

export default HeroHome;
