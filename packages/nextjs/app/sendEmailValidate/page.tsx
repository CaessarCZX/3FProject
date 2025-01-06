"use client";

import withAccessControl from "../hoc/withAccessControl";
import { SendEmailValidate } from "./_components/sendEmailValidate";
import type { NextPage } from "next";

// import { SignInForm } from "~~/app/login/_components/SignInFrom";

const validateEmail: NextPage = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div
        className="w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: "url(https://cdn.easyfrontend.com/pictures/contact/contact13.jpg)",
        }}
      ></div>

      {/* Right Section */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <div className="max-w-md w-full space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Cambiar Contraseña</h2>
          <SendEmailValidate />
        </div>
      </div>
    </div>
  );
};

export default withAccessControl(validateEmail);
