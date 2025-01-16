"use client";

import withAccessControl from "../hoc/withAccessControl";
import { SendEmailValidate } from "./_components/sendEmailValidate";
import type { NextPage } from "next";

const validateEmail: NextPage = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Imagen de fondo para móviles y columna izquierda para pantallas grandes */}
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center dark:brightness-50 dark:grayscale"
        style={{
          backgroundImage: "url(https://cdn.easyfrontend.com/pictures/contact/contact13.jpg)",
        }}
      ></div>

      <div
        className="md:hidden bg-cover bg-center absolute inset-0 -z-10"
        style={{
          backgroundImage: "url(https://cdn.easyfrontend.com/pictures/contact/contact13.jpg)",
        }}
      ></div>

      {/* Sección de contenido */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-opacity-80 md:bg-opacity-100 min-h-screen md:min-h-0 bg-white dark:bg-boxdark-2">
        <div className="max-w-md w-full space-y-8 p-6 md:p-0">
          <SendEmailValidate />
        </div>
      </div>
    </div>
  );
};

export default withAccessControl(validateEmail);
