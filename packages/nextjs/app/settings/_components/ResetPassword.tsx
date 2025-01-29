import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Tooltip } from "./Tooltip";
import { jwtDecode } from "jwt-decode";
import { FiHelpCircle } from "react-icons/fi";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import BlockContainerWithTitle from "~~/components/UI/BlockContainerWithTitle";
import { Btn, BtnLoading } from "~~/components/UI/Button";
import { PasswordFeedback } from "~~/components/UI/PasswordFeedback";
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

  const validatePasswordCriteria = (password: string) => {
    setPasswordCriteria({
      hasMinLength: password.length >= 8,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[@$!#?]/.test(password),
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
    <BlockContainerWithTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            {passwordCriteriaModalVisible && <PasswordFeedback passwordCriteria={passwordCriteria} />}
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
        <Btn onClick={handlePasswordChange} disabled={isSaving || !Object.values(passwordCriteria).every(Boolean)}>
          <BtnLoading text="Cambiar Contraseña" changeState={isSaving} />
        </Btn>
      </div>
    </BlockContainerWithTitle>
  );
};

export default ResetPassword;
