"use client";

import React, { useState } from "react";

export const SignInForm = () => {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  return (
    <form noValidate data-validated={validated} onSubmit={handleSubmit}>
      <div>
        <div className="w-full mb-4">
          <input
            type="text"
            className="w-full min-h-[48px] leading-10 bg-white rounded-full px-6 font-bold focus:outline-none border-2 border-transparent focus:border-blue-600 duration-300"
            id="name"
            placeholder="Username"
          />
        </div>
        <div className="w-full mb-4">
          <input
            type="password"
            className="w-full min-h-[48px] leading-10 bg-white rounded-full px-6 font-bold focus:outline-none border-2 border-transparent focus:border-blue-600 duration-300"
            id="password"
            placeholder="Password"
          />
        </div>

        <button
          type="submit"
          className="h-12 py-3 px-7 font-semibold text-white rounded-full bg-blue-600 hover:bg-opacity-90 duration-300 w-full"
        >
          SIGN IN
        </button>
      </div>

      <div className="text-center mt-6 text-lg duration-300 hover:text-blue-600">
        <a href="#!">Forget Username / Contrasenia ?</a>
      </div>
    </form>
  );
};
