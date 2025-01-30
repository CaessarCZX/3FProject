import React from "react";
import Link from "next/link";

interface TermsAgreeProps {
  checked: boolean;
  id: string;
  name: string;
  changeFunction: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
}

const TermsAgree: React.FC<TermsAgreeProps> = ({ checked, id, name, changeFunction, className }) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      id={id}
      name={name}
      checked={checked}
      onChange={changeFunction}
      className={`mr-2 h-4 w-4 rounded focus:ring-blue-500 border-gray-300  ${className}`}
      required
    />
    <label htmlFor="terms" className="text-sm font-medium text-gray-700 dark:text-gray-400">
      Acepto los{" "}
      <Link href="/terms" className="text-blue-500 hover:underline">
        Términos y condiciones
      </Link>
    </label>
  </div>
);

export default TermsAgree;
