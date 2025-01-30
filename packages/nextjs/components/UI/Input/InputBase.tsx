import React from "react";

export const CommonBorder = "border-stroke focus:border-primary dark:border-strokedark dark:focus:border-primary";

const InputBase: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => {
  return (
    <input
      className={`
      w-full
      rounded
      border
      bg-white
      read-only:bg-gray-100
      read-only:dark:bg-form-input
      read-only:cursor-default
      read-only:focus:border-none
      py-3
      text-black
      focus-visible:outline-none
      dark:bg-meta-4
      dark:text-white
      ${className}`}
      {...props}
    />
  );
};

export default InputBase;
