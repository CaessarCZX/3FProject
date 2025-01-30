import { ReactNode } from "react";
import InputBase from "./InputBase";
import { CommonBorder } from "./InputBase";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  validationState?: "success" | "error" | "default";
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  id,
  className,
  validationState = "default",
  ...props
}) => {
  //For validation feedback border
  const borderClass =
    validationState === "success"
      ? "border-green-500 focus:border-green-500"
      : validationState === "error"
      ? "border-red-500 focus:border-red-500"
      : CommonBorder;
  return (
    <div className="flex flex-col">
      <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        {icon && <span className="absolute left-4.5 top-4">{icon}</span>}
        <InputBase id={id} className={`pl-11.5 pr-4.5 ${borderClass} ${className}`} {...props} />
      </div>
    </div>
  );
};

export default InputField;
