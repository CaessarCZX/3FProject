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
        className="hidden md:block md:w-1/2 bg-cover bg-center"
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
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white bg-opacity-80 md:bg-opacity-100 min-h-screen md:min-h-0">
        <div className="max-w-md w-full space-y-8 p-6 md:p-0">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Regístrate</h2>
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default withAccessControl(Register);
