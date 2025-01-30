import React from "react";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";

interface PasswordRequirementProps {
  isMet: boolean;
  text: string;
}

const PasswordRequirement: React.FC<PasswordRequirementProps> = ({ isMet, text }) => (
  <div className="flex items-center py-2">
    {isMet ? <BsCheckCircleFill className="text-green-500 mr-1" /> : <BsXCircleFill className="text-red-500 mr-1" />}
    <p className="m-0 text-[14px]">{text}</p>
  </div>
);

interface PasswordFeedbackProps {
  passwordCriteria: {
    hasMinLength: boolean;
    hasLowercase: boolean;
    hasUppercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

export const PasswordFeedback: React.FC<PasswordFeedbackProps> = ({ passwordCriteria }) => {
  const criteriaList = [
    { key: "hasMinLength", text: "Al menos 8 caracteres" },
    { key: "hasLowercase", text: "Al menos una minúscula" },
    { key: "hasUppercase", text: "Al menos una mayúscula" },
    { key: "hasNumber", text: "Al menos un número" },
    { key: "hasSpecialChar", text: "Al menos un carácter especial" },
  ];

  return (
    <div className="absolute mt-2 w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-md z-10">
      <div className="grid grid-cols-2 xl:block text-xs p-4">
        {criteriaList.map(({ key, text }) => (
          <PasswordRequirement key={key} isMet={passwordCriteria[key as keyof typeof passwordCriteria]} text={text} />
        ))}
      </div>
    </div>
  );
};
