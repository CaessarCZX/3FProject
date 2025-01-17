import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Tooltip } from "./Tooltip";
import { jwtDecode } from "jwt-decode";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import { FiHelpCircle } from "react-icons/fi";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import { notification } from "~~/utils/scaffold-eth/notification";

interface DecodedToken {
  id: string;
  name: string;
  email: string;
  wallet: string;
}

const ResetPassword: React.FC = () => {
  const [userInfo, setUserInfo] = useState<{
    email: string;
    wallet: string;
  } | null>(null);
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [passwordCriteriaModalVisible, setPasswordCriteriaModalVisible] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    hasMinLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const router = useRouter();
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (passwordInputRef.current && !passwordInputRef.current.contains(event.target as Node)) {
        setPasswordCriteriaModalVisible(false);
      }
    };

    if (passwordCriteriaModalVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [passwordCriteriaModalVisible]);

  const validatePasswordCriteria = (password: string) => {
    setPasswordCriteria({
      hasMinLength: password.length >= 8,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[@!#?]/.test(password),
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        setUserInfo({
          email: decodedToken.email,
          wallet: decodedToken.wallet,
        });
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, []);

  const handlePasswordChange = async () => {
    if (!password || !repeatPassword) {
      notification.error("Por favor, completa ambos campos.", {
        position: "bottom-right",
        duration: 5000,
      });
      return;
    }
    if (password !== repeatPassword) {
      notification.error("Las contraseñas no coinciden.", {
        position: "bottom-right",
        duration: 5000,
      });
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/users/resetPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userInfo?.email,
          wallet: userInfo?.wallet,
          newPassword: password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        notification.success(result.message || "¡Contraseña cambiada exitosamente!", {
          position: "bottom-right",
          duration: 5000,
        });
        setPassword("");
        setRepeatPassword("");
        // Redirigir al usuario a la página de inicio
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        notification.error(result.message || "Error al cambiar la contraseña.", {
          position: "bottom-right",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error al llamar a la API:", error);
      notification.error("Hubo un error al cambiar la contraseña. Inténtalo de nuevo.", {
        position: "bottom-right",
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="mx-auto overflow-hidden bg-white  dark:bg-boxdark dark:border-strokedark shadow-default rounded-lg p-6">
        <h2 className="text-3xl font-light text-gray-500 dark:text-gray-400">Cambiar Contraseña</h2>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-500">Nueva Contraseña</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-500">Contraseña</label>
              <div className="relative" ref={passwordInputRef}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    validatePasswordCriteria(e.target.value);
                  }}
                  placeholder="Nueva contraseña"
                  onFocus={() => {
                    setPasswordCriteriaModalVisible(true);
                  }}
                  onBlur={() => {
                    if (!password) {
                      setPasswordCriteriaModalVisible(false);
                    }
                  }}
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-form-strokedark dark:text-whiten"
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
                <div className="absolute inset-y-0 right-10 pr-3 flex items-center">
                  <Tooltip
                    content={
                      <ul>
                        <li>Al menos 8 caracteres</li>
                        <li>Al menos una minúscula y una mayúscula</li>
                        <li>Al menos un número</li>
                        <li>
                          Al menos un carácter especial: <span className="font-bold">@ ! # ?</span>
                        </li>
                      </ul>
                    }
                  >
                    <FiHelpCircle className="text-gray-400 cursor-pointer" />
                  </Tooltip>
                </div>
                {/* Password Criteria Feedback */}
                {passwordCriteriaModalVisible && (
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
                        <p className="text-[14px] ">Al menos un carácter especial: @ ! # ?</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-500">Repetir Contraseña</label>
              <div className="relative">
                <input
                  type={showRepeatPassword ? "text" : "password"}
                  value={repeatPassword}
                  onChange={e => setRepeatPassword(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-form-strokedark dark:text-whiten"
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                >
                  {showRepeatPassword ? (
                    <RiEyeLine className="text-gray-600 dark:text-gray-300" />
                  ) : (
                    <RiEyeCloseLine className="text-gray-600 dark:text-gray-300" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handlePasswordChange}
              disabled={isSaving || !Object.values(passwordCriteria).every(Boolean)}
              className={`px-6 py-2 ${
                isSaving
                  ? "bg-gray-400"
                  : "bg-brand-default hover:bg-brand-hover dark:bg-blue-600 dark:hover:bg-blue-700"
              } text-white rounded-md shadow focus:outline-none`}
            >
              {isSaving ? "Guardando..." : "Cambiar Contraseña"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
