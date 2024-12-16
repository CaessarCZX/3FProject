// /app/not-found.js o /pages/404.js
import React from "react";
import Image from "next/image";
import Link from "next/link";

// py-48 md:py-80
const NotFound: React.FC = () => {
  return (
    <section className="w-screen h-screen grid bg-white dark:bg-[#0b1727] text-[#04004d] dark:text-white relative overflow-hidden z-[1]">
      {/* svg */}
      <Image
        width={800}
        height={500}
        className="absolute bottom-0 right-0 -z-[1] w-auto h-auto"
        src="/backgrounds/three.svg"
        alt=""
        priority
      />

      <div className="container px-4 mx-auto place-content-center">
        <div className="flex justify-center lg:justify-start">
          <div className="text-center lg:text-start">
            <h2 className="text-8xl leading-none font-bold md:text-[160px] mb-6">404</h2>
            <p className="text-3xl leading-none md:text-5xl opacity-80">Pagina no encontrada</p>
            <p className="text-sm leading-none md:text-base max-w-[450px] opacity-80">
              La pagina que estas buscando no se encuentra por favor dirígete a la página principal
            </p>
            <Link href="/">
              <button className="mt-6 font-medium px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Regresar al inicio
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
