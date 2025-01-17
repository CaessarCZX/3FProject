import React from "react";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";

interface PasswordCriteriaData {
  hasMinLength: boolean;
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

interface PasswordFeedbackProps {
  passwordCriteria: PasswordCriteriaData;
}

export const PasswordFeedback: React.FC<PasswordFeedbackProps> = ({ passwordCriteria }) => {
  return (
    <div className="absolute mt-2 w-[250px] bg-white dark:bg-gray-800  border dark:border-gray-700 rounded-md shadow-md z-10">
      <div className="ml-4 flex flex-col space-y-1 text-sm p-2">
        <div className="flex items-center">
          {passwordCriteria.hasMinLength ? (
            <BsCheckCircleFill className="text-green-500 mr-1" />
          ) : (
            <BsXCircleFill className="text-red-500 mr-1" />
          )}
          <p className="text-[14px] ">Al menos 8 caracteres</p>
        </div>
        <div className="flex items-center">
          {passwordCriteria.hasLowercase ? (
            <BsCheckCircleFill className="text-green-500 mr-1" />
          ) : (
            <BsXCircleFill className="text-red-500 mr-1" />
          )}
          <p className="text-[14px] ">Al menos una minúscula</p>
        </div>
        <div className="flex items-center">
          {passwordCriteria.hasUppercase ? (
            <BsCheckCircleFill className="text-green-500 mr-1" />
          ) : (
            <BsXCircleFill className="text-red-500 mr-1" />
          )}
          <p className="text-[14px] ">Al menos una mayúscula</p>
        </div>
        <div className="flex items-center">
          {passwordCriteria.hasNumber ? (
            <BsCheckCircleFill className="text-green-500 mr-1" />
          ) : (
            <BsXCircleFill className="text-red-500 mr-1" />
          )}
          <p className="text-[14px] ">Al menos un número</p>
        </div>
        <div className="flex items-center">
          {passwordCriteria.hasSpecialChar ? (
            <BsCheckCircleFill className="text-green-500 mr-1" />
          ) : (
            <BsXCircleFill className="text-red-500 mr-1" />
          )}
          <p className="text-[14px] ">Al menos un carácter especial: @ $ ! # ?</p>
        </div>
      </div>
    </div>
  );
};
