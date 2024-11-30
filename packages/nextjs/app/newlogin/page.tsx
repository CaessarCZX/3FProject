"use client";

import type { NextPage } from "next";
import { SignInForm } from "~~/app/newlogin/_components/SignInFrom";

const Login: NextPage = () => {
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
          <h2 className="text-3xl font-bold text-gray-900 text-center">Inicia Sesión</h2>
          <SignInForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
