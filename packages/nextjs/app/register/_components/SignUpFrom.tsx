"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Tooltip } from "./Tooltip";
import { FiHelpCircle, FiLock, FiMail, FiUser } from "react-icons/fi";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import { isAddress } from "viem";
import { useAccount } from "wagmi";
import { WalletConnectionBtn } from "~~/components/Wallet/WalletConectionBtn";
import ApiRateLimiter from "~~/utils/API/ApiRateLimiter";
import { RenderWarningMessages, validateFormData } from "~~/utils/Form/register";
import { notification } from "~~/utils/scaffold-eth/notification";

const ETH_WALLET_LENGTH = 42;

export const SignUpForm = () => {
  // Show password feature
  const [showpass, setShowpass] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    wallet: "",
    referredBy: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false); // Validacion de wallet
  // Validador de referido
  const [isReferrerValid, setIsReferrerValid] = useState<boolean | null>(null);
  // Mensajes
  const [successMessage, setSuccessMessage] = useState("");
  const [singleErrorMessage, setSingleErrorMessage] = useState("");

  //For blockchain
  const currentUser = useAccount();

  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get("email");
    if (email) {
      setFormData(prev => ({ ...prev, email }));
    }
  }, []);

  // Mensajes a ui
  useEffect(() => {
    if (singleErrorMessage) {
      notification.error(singleErrorMessage, {
        position: "bottom-right",
        duration: 5000,
      }); // Muestra la notificicacion con el error encontrado
      setSingleErrorMessage(""); // Borra el mensaje de error registrado
    }

    if (successMessage) {
      notification.success(successMessage, {
        position: "bottom-right",
        duration: 5000,
      });
      setSuccessMessage("");
    }
  }, [singleErrorMessage, successMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Reset validation when "wallet" changes
    if (name === "wallet") {
      setIsWalletConnected(false);
      setSingleErrorMessage("");
      setSuccessMessage("");
    }

    // Reset validation when "referredBy" changes
    if (name === "referredBy") {
      setIsReferrerValid(false);
      setSingleErrorMessage("");
      setSuccessMessage("");
    }
  };

  // Limitador para llamadas a la API
  const rateLimiter = useRef(new ApiRateLimiter());

  const handleValidateReferrer = useCallback(async () => {
    setSingleErrorMessage("");
    setSuccessMessage("");

    if (!formData.referredBy) {
      setSingleErrorMessage("Por favor, introduce una wallet de referido.");
      return;
    }

    try {
      await rateLimiter.current.executeWithRateLimit(async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/users/check-wallet`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ wallet: formData.referredBy }),
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.exists) {
            setSuccessMessage("Wallet de referido válida.");
            setIsReferrerValid(true);
          } else {
            setSingleErrorMessage("La wallet de referido no está registrada.");
            setIsReferrerValid(false);
          }
        } else {
          const errorData = await response.json();
          setSingleErrorMessage(errorData.message || "Error al validar la wallet de referido.");
          setIsReferrerValid(false);
        }
      });
    } catch (error) {
      setSingleErrorMessage("No se pudo conectar con el servidor.");
      setIsReferrerValid(false);
    }
  }, [formData.referredBy]);

  // automatic referred wallet validation
  useEffect(() => {
    if (formData.referredBy.length === 0) setIsReferrerValid(null); // To set in null

    // To validate referred wallet
    if (formData.referredBy.length === ETH_WALLET_LENGTH) {
      if (!isAddress(formData.referredBy)) {
        notification.error("No es un formato de wallet valido.", {
          position: "bottom-right",
          duration: 5000,
        });
        return;
      }

      // Ejecutar la validacion
      handleValidateReferrer();
    }
  }, [formData.referredBy, handleValidateReferrer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setSingleErrorMessage("");

    //For wallet connection
    if (!isWalletConnected) {
      setSingleErrorMessage("No tienes conectada una wallet");
      setIsSubmitting(true);
      return;
    }

    // For validations
    const validation = validateFormData(formData);
    if (Object.values(validation).length > 0) {
      RenderWarningMessages(validation);
      setIsSubmitting(false);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        isAdmin: false,
        isActive: true,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
        credentials: "include",
      });

      if (response.ok) {
        setSuccessMessage("¡Registro exitoso! Redirigiendo...");
        const saveEmail = formData.email;
        setFormData({
          name: "",
          email: "",
          password: "",
          wallet: "",
          referredBy: "",
        });
        setIsWalletConnected(false);
        setIsReferrerValid(false);

        const loginUrl = saveEmail ? `/login?email=${encodeURIComponent(saveEmail)}` : "/login";
        sessionStorage.setItem("allowAccess", "true");
        router.push(loginUrl);
      } else {
        const errorData = await response.json();
        setSingleErrorMessage(errorData.message || "Error en el registro.");
      }
    } catch (error) {
      setSingleErrorMessage("No se pudo conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConnectWallet = useCallback(async () => {
    setSingleErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/users/check-wallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wallet: formData.wallet }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        if (data.exists) {
          setSingleErrorMessage("Esta wallet ya está registrada.");
          setIsWalletConnected(false); // Deshabilitar el registro si la wallet está registrada
        } else {
          setSuccessMessage("Wallet conectada con éxito.");
          setIsWalletConnected(true); // Habilitar el registro
        }
      } else {
        const errorData = await response.json();
        setSingleErrorMessage(errorData.message || "Error al verificar la wallet.");
        setIsWalletConnected(false); // Deshabilitar registro si ocurre un error con la wallet
      }
    } catch (error) {
      setSingleErrorMessage("No se pudo conectar con el servidor.");
      setIsWalletConnected(false);
    }
  }, [formData.wallet]);

  // Para obtener direccion automatica de wallet conectada
  useEffect(() => {
    if (currentUser.status === "connected") {
      setFormData(prevData => ({
        ...prevData,
        wallet: currentUser.address ?? "",
      }));
      const checkConnect = setTimeout(() => handleConnectWallet(), 2000);
      return () => clearTimeout(checkConnect);
    }

    if (currentUser.status === "disconnected") setFormData(prevData => ({ ...prevData, wallet: "" }));
  }, [currentUser.status, currentUser.address, handleConnectWallet]);

  // Función para manejar el clic en el enlace de registro
  const handleLoginClick = () => {
    const email = formData.email;
    const loginUrl = email ? `/login?email=${encodeURIComponent(email)}` : "/login";
    sessionStorage.setItem("allowAccess", "true");
    router.push(loginUrl);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre
        </label>
        <div className="mt-1 relative">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full pr-10 pl-4 font-light text-gray-700 dark:text-white py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Ingresa tu nombre"
            required
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FiUser />
          </div>
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1 relative">
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="new-username"
            value={formData.email}
            readOnly
            className="block w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none sm:text-sm"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FiMail />
          </div>
        </div>
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <div className="mt-1 relative">
          <input
            type={showpass ? "text" : "password"}
            id="password"
            name="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              if (!formData.password) {
                setIsFocused(false);
              }
            }}
            className="block w-full pl-4 pr-10 py-2 font-light text-gray-700 dark:text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Ingresa una nueva contraseña"
            required
          />
          <div
            className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-auto ${
              isFocused && "cursor-pointer"
            }`}
            onClick={e => {
              e.stopPropagation();
              isFocused && setShowpass(!showpass);
            }}
          >
            {!isFocused ? (
              <FiLock className="text-gray-400" />
            ) : showpass ? (
              <RiEyeLine className="text-gray-600" />
            ) : (
              <RiEyeCloseLine className="text-gray-600" />
            )}
          </div>
          <div className="absolute inset-y-0 right-10 pr-3 pt-3 flex items-center">
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
        </div>
      </div>

      {/* Wallet */}
      <div>
        <label htmlFor="wallet" className="block text-sm font-medium text-gray-700">
          Wallet
        </label>
        <div className="mt-1 relative flex">
          <WalletConnectionBtn enableWallet={isWalletConnected} classBtn="w-full rounded-md" />
        </div>
      </div>

      {/* Referred Wallet */}
      <div>
        <label htmlFor="referredBy" className="block text-sm font-medium text-gray-700">
          Wallet de Referido
        </label>
        <div className="mt-1 relative">
          <input
            autoComplete="none"
            type="text"
            id="referredBy"
            name="referredBy"
            value={formData.referredBy}
            onChange={handleChange}
            className={`block w-full pl-4 pr-20 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              isReferrerValid === null ? "bg-transparent" : isReferrerValid === false ? "bg-red-100" : "bg-green-100"
            }`}
            placeholder="0xABC123"
            required
          />
          {isReferrerValid === false && (
            <p className="m-0 absolute text-[12px] text-center w-full translate-y-10 text-red-500">Wallet invalida</p>
          )}
        </div>
      </div>

      {/* Login link */}
      <div className="text-sm text-center">
        <p>
          ¿Ya tienes una cuenta?{" "}
          <a href="#" className="text-blue-600 hover:text-blue-800" onClick={handleLoginClick}>
            Inicia sesión aquí
          </a>
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || !isWalletConnected || !isReferrerValid}
        className={`w-full py-2 px-4 border border-transparent disabled:bg-gray-300 rounded-md shadow-sm text-sm font-medium text-white ${
          isSubmitting || !isWalletConnected || !isReferrerValid ? "bg-gray-500" : "bg-gray-900 hover:bg-gray-700"
        }`}
      >
        {isSubmitting ? "Registrando..." : "Registrar"}
      </button>

      {/* Mensajes de éxito o error */}
      {successMessage && <p className="text-green-600 text-sm mt-2">{successMessage}</p>}
      {singleErrorMessage && <p className="text-red-600 text-sm mt-2">{singleErrorMessage}</p>}
    </form>
  );
};
