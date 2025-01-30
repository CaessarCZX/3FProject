"use client";

import withAccessControl from "../hoc/withAccessControl";
import { SignUpForm } from "./_components/SignUpFrom";
import type { NextPage } from "next";

// import { SignUpForm } from "~~/app/register/_components/SignInFrom";

const Register: NextPage = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Imagen de fondo para móviles y columna izquierda para pantallas grandes */}
      <div
        className="hidden lg:block md:w-1/2 bg-cover bg-center bg-fixed dark:brightness-50 dark:grayscale"
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
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-opacity-80 dark:bg-opacity-80 md:bg-opacity-100 dark:md:bg-opacity-100 min-h-screen md:min-h-0 bg-white dark:bg-boxdark-2">
        <div className="max-w-md xl:max-w-lg w-full space-y-8 p-8 rounded-lg bg-white dark:bg-boxdark-2 md:p-0 md:my-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-whiten text-center">Regístrate</h2>
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default withAccessControl(Register);
