import React from "react";

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

interface BtnLoadingProps {
  text: string;
  changeState: boolean;
}

export const Btn: React.FC<BtnProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`px-6 py-2 bg-brand-default hover:bg-brand-hover dark:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white rounded-md shadow focus:outline-none animate-fadeIn ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const BtnStates: React.FC<BtnProps & { changeState: boolean | undefined }> = ({
  children,
  className,
  changeState,
  ...props
}) => {
  return (
    <button
      className={`px-6 py-2 ${
        changeState
          ? "bg-red-500 hover:bg-red-700 dark:bg-red-800 dark:hover:bg-red-900"
          : "bg-brand-default hover:bg-brand-hover dark:bg-blue-600 dark:hover:bg-blue-700"
      }  disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white rounded-md shadow focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const BtnLoading: React.FC<BtnLoadingProps> = ({ text, changeState }) => (
  <>
    <div className="flex w-full items-center justify-center">
      {!changeState ? text : <span className="loading loading-dots loading-md animate-fadeIn"></span>}
    </div>
  </>
);

export const SignBtn: React.FC<BtnProps> = ({ children, className, ...props }) => (
  <button
    className={`w-full px-4 py-2 border border-transparent bg-gray-900 hover:bg-gray-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white rounded-md shadow-sm focus:outline-none animate-fadeIn ${className}`}
    {...props}
  >
    {children}
  </button>
);
