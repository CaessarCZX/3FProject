"use client";

import withAccessControl from "../hoc/withAccessControl";
import { SignUpForm } from "./_components/SignInFrom";
import type { NextPage } from "next";

// import { SignUpForm } from "~~/app/register/_components/SignInFrom";

const Register: NextPage = () => {
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
      <div className="w-1/2 flex items-center justify-center bg-white dark:bg-transparent">
        <div className="max-w-md w-full space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Regístrate</h2>
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default withAccessControl(Register);
