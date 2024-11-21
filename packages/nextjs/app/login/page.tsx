import React from "react";
// import Image from "next/image";
import { SignInForm } from "./_components/SignInFrom";
import { NextPage } from "next";

const Login: NextPage = () => {
  return (
    <section
      className="ezy__signin16 light flex items-center justify-center bg-cover bg-center bg-no-repeat text-white relative overflow-hidden z-[1] py-28 lg:py-48"
      style={{
        backgroundImage: "url(https://cdn.easyfrontend.com/pictures/background/background3.jpg)",
      }}
    >
      <div
        className="absolute top-0 right-0 left-0 bottom-0 opacity-80 -z-[1]"
        style={{ background: "linear-gradient(to bottom, #005bea, #00c6fb)" }}
      />
      <div className="container px-4 mx-auto">
        <div className="flex justify-center items-center">
          <div className="w-full md:w-5/12 lg:w-1/4 text-center">
            <img
              src="https://cdn.easyfrontend.com/pictures/icons/user.png"
              alt=""
              className="w-24 h-auto mb-6 mx-auto"
            />
            <h2 className="text-3xl font-light leading-none mb-12">Unknown</h2>
            <SignInForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
