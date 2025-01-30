import { ReactNode, useEffect, useRef, useState } from "react";
import { HelperPassword } from "../Helper/Password";
import { PasswordFeedback } from "../PasswordFeedback";
import InputBase from "./InputBase";
import { CommonBorder } from "./InputBase";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import { PasswordRegex } from "~~/utils/Form";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  showValidator?: boolean;
  validationState?: "success" | "error" | "default";
  enableHelper?: boolean;
  password: string;
  setPassword: (password: string) => void;
}

const InputPassword: React.FC<InputFieldProps> = ({
  label,
  icon,
  id,
  className,
  showValidator,
  validationState = "default",
  enableHelper,
  password,
  setPassword,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [validatorVisible, setValidatorVisible] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  //For validation feedback border
  const borderClass =
    validationState === "success"
      ? "border-green-500 focus:border-green-500"
      : validationState === "error"
      ? "border-red-500 focus:border-red-500"
      : CommonBorder;

  const [passwordCriteria, setPasswordCriteria] = useState({
    hasMinLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const validatePasswordCriteria = (password: string) => {
    setPasswordCriteria({
      hasMinLength: password.length >= 8,
      hasLowercase: PasswordRegex.hasLowercase.test(password),
      hasUppercase: PasswordRegex.hasUppercase.test(password),
      hasNumber: PasswordRegex.hasNumber.test(password),
      hasSpecialChar: PasswordRegex.hasSpecialChar.test(password),
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (passwordInputRef.current && !passwordInputRef.current.contains(event.target as Node)) {
        setValidatorVisible(false);
      }
    };

    if (validatorVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [validatorVisible]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-3 mr-3">
        <label className="block text-sm font-medium text-black dark:text-white" htmlFor={id}>
          {label}
        </label>
        {enableHelper && <HelperPassword />}
      </div>
      <div className="relative" ref={passwordInputRef}>
        {icon && <span className="absolute left-4.5 top-4">{icon}</span>}

        <InputBase
          id={id}
          autoComplete="new-password"
          value={password}
          type={showPassword ? "text" : "password"}
          className={`pl-11.5 pr-4.5 ${borderClass} ${className}`}
          onChange={e => {
            setPassword(e.target.value);
            validatePasswordCriteria(e.target.value);
          }}
          placeholder="Nueva contraseña"
          onFocus={() => {
            setValidatorVisible(true);
          }}
          onBlur={() => {
            if (!password) {
              setValidatorVisible(false);
            }
          }}
          {...props}
        />
        <div
          className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <RiEyeLine className="text-gray-600 dark:text-gray-300" />
          ) : (
            <RiEyeCloseLine className="text-gray-600 dark:text-gray-300" />
          )}
        </div>
        {/* Password Criteria Feedback */}
        {showValidator && validatorVisible && <PasswordFeedback passwordCriteria={passwordCriteria} />}
      </div>
    </div>
  );
};

export default InputPassword;
