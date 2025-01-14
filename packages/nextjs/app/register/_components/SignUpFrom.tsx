"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Helper } from "./Helper";
import { PasswordCriteriaFeedback } from "./PasswordCriteriaFeedback";
import { FiLock, FiMail, FiUser } from "react-icons/fi";
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
  const [passwordCriteriaModalVisible, setPasswordCriteriaModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    wallet: "",
    referredBy: "",
    terms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  // Validador de referido
  const [isReferrerValid, setIsReferrerValid] = useState<boolean | null>(null);
  // Mensajes
  const [successMessage, setSuccessMessage] = useState("");
  const [singleErrorMessage, setSingleErrorMessage] = useState("");
  // Password criteria states
  const [passwordCriteria, setPasswordCriteria] = useState({
    hasMinLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  // Error states for each field
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    wallet: "",
    referredBy: "",
    terms: "",
  });
  //For blockchain
  const currentUser = useAccount();

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
      });
      setSingleErrorMessage("");
    }

    if (successMessage) {
      notification.success(successMessage, {
        position: "bottom-right",
        duration: 5000,
      });
      setSuccessMessage("");
    }
  }, [singleErrorMessage, successMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Password validation on change
    if (name === "password") {
      validatePasswordCriteria(value);
      // Clear password error message
      setFieldErrors(prev => ({ ...prev, password: "" }));
    }

    // Reset validation when "wallet" changes
    if (name === "wallet") {
      setIsWalletConnected(false);
      setSingleErrorMessage("");
      setSuccessMessage("");
      setFieldErrors(prev => ({ ...prev, wallet: "" }));
    }

    // Reset validation when "referredBy" changes
    if (name === "referredBy") {
      setIsReferrerValid(false);
      setSingleErrorMessage("");
      setSuccessMessage("");
      setFieldErrors(prev => ({ ...prev, referredBy: "" }));
    }

    // Clear terms error
    if (name === "terms") {
      setFieldErrors(prev => ({ ...prev, terms: "" }));
    }
  };

  const validatePasswordCriteria = (password: string) => {
    setPasswordCriteria({
      hasMinLength: password.length >= 8,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[@!#?]/.test(password),
    });
  };

  // Limitador para llamadas a la API
  const rateLimiter = useRef(new ApiRateLimiter());

  const handleValidateReferrer = useCallback(async () => {
    setSingleErrorMessage("");
    setSuccessMessage("");

    if (!formData.referredBy) {
      setSingleErrorMessage("Por favor, introduce una wallet de referido.");
      setFieldErrors(prev => ({ ...prev, referredBy: "Por favor, introduce una wallet de referido." }));

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
            setFieldErrors(prev => ({ ...prev, referredBy: "" }));
          } else {
            setSingleErrorMessage("La wallet de referido no está registrada.");
            setIsReferrerValid(false);
            setFieldErrors(prev => ({ ...prev, referredBy: "La wallet de referido no está registrada." }));
          }
        } else {
          const errorData = await response.json();
          setSingleErrorMessage(errorData.message || "Error al validar la wallet de referido.");
          setIsReferrerValid(false);
          setFieldErrors(prev => ({
            ...prev,
            referredBy: errorData.message || "Error al validar la wallet de referido.",
          }));
        }
      });
    } catch (error) {
      setSingleErrorMessage("No se pudo conectar con el servidor.");
      setFieldErrors(prev => ({ ...prev, referredBy: "No se pudo conectar con el servidor." }));

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

  const sendRegisterEmail = async (email: string, name: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/sendgrid/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toEmail: email,
        userName: name,
      }),
    });
  };
  const sendAffiliateEmail = async (affiliateName: string, affiliateEmail: string, referredBy: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/sendgrid/newAffiliate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        affiliateName: affiliateName,
        affiliateEmail: affiliateEmail,
        referredBy: referredBy,
      }),
    });
  };

  const createUser = async (formData: typeof SignUpForm.prototype.formData) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        isAdmin: false,
        isActive: true,
      }),
      credentials: "include",
    });
    return response;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setSingleErrorMessage("");

    //For wallet connection
    if (!isWalletConnected) {
      setSingleErrorMessage("No tienes conectada una wallet");
      setFieldErrors(prev => ({ ...prev, wallet: "No tienes conectada una wallet" }));

      setIsSubmitting(true);
      return;
    }

    // For validations
    const validation = validateFormData(formData);

    if (Object.keys(validation).length > 0) {
      RenderWarningMessages(validation);
      setIsSubmitting(false);
      setFieldErrors(prev => ({ ...prev, ...validation }));
      return;
    }
    if (!formData.terms) {
      setFieldErrors(prev => ({ ...prev, terms: "Debes aceptar los términos y condiciones" }));
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await createUser(formData);

      if (response.ok) {
        await sendRegisterEmail(formData.email, formData.name);
        await sendAffiliateEmail(formData.name, formData.email, formData.referredBy);

        setSuccessMessage("¡Registro exitoso! Redirigiendo...");
        const saveEmail = formData.email;
        setFormData({
          name: "",
          email: "",
          password: "",
          wallet: "",
          referredBy: "",
          terms: false,
        });
        setIsWalletConnected(false);
        setIsReferrerValid(false);
        setPasswordCriteria({
          hasMinLength: false,
          hasLowercase: false,
          hasUppercase: false,
          hasNumber: false,
          hasSpecialChar: false,
        });
        setFieldErrors({
          name: "",
          email: "",
          password: "",
          wallet: "",
          referredBy: "",
          terms: "",
        });

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
          setFieldErrors(prev => ({ ...prev, wallet: "Esta wallet ya está registrada." }));
          setIsWalletConnected(false);
        } else {
          setSuccessMessage("Wallet conectada con éxito.");
          setIsWalletConnected(true);
          setFieldErrors(prev => ({ ...prev, wallet: "" }));
        }
      } else {
        const errorData = await response.json();
        setFieldErrors(prev => ({ ...prev, wallet: errorData.message || "Error al verificar la wallet." }));
        setSingleErrorMessage(errorData.message || "Error al verificar la wallet.");
        setIsWalletConnected(false);
      }
    } catch (error) {
      setSingleErrorMessage("No se pudo conectar con el servidor.");
      setFieldErrors(prev => ({ ...prev, wallet: "No se pudo conectar con el servidor." }));
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
            className={`block w-full pr-10 pl-4 font-light text-gray-700 dark:text-white py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              fieldErrors.name ? "border-red-500" : ""
            }`}
            placeholder="Ingresa tu nombre"
            required
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FiUser />
          </div>
        </div>
        {fieldErrors.name && <p className="text-red-500 text-sm mt-1 ml-1">{fieldErrors.name}</p>}
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
            className={`block w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none sm:text-sm ${
              fieldErrors.email ? "border-red-500" : ""
            }`}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FiMail />
          </div>
        </div>
        {fieldErrors.email && <p className="text-red-500 text-sm mt-1 ml-1">{fieldErrors.email}</p>}
      </div>

      {/* Password */}
      <div>
        <div className="flex justify-between items-center mr-3">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <Helper />
        </div>
        <div className="mt-1 relative" ref={passwordInputRef}>
          <input
            type={showpass ? "text" : "password"}
            id="password"
            name="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => {
              setIsFocused(true);
              setPasswordCriteriaModalVisible(true);
            }}
            onBlur={() => {
              if (!formData.password) {
                setIsFocused(false);
                setPasswordCriteriaModalVisible(false);
              }
            }}
            className={`block w-full pl-4 pr-10 py-2 font-light text-gray-700 dark:text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              fieldErrors.password ? "border-red-500" : ""
            }`}
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
          {/* Password Criteria Feedback */}
          {passwordCriteriaModalVisible && <PasswordCriteriaFeedback passwordCriteria={passwordCriteria} />}
        </div>
        {fieldErrors.password && <p className="text-red-500 text-sm mt-1 ml-1">{fieldErrors.password}</p>}
      </div>

      {/* Wallet */}
      <div>
        <label htmlFor="wallet" className="block text-sm font-medium text-gray-700">
          Wallet
        </label>
        <div className="mt-1 relative flex">
          <WalletConnectionBtn enableWallet={isWalletConnected} classBtn="w-full rounded-md" />
        </div>
        {fieldErrors.wallet && <p className="text-red-500 text-sm mt-1 ml-1">{fieldErrors.wallet}</p>}
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
              isReferrerValid === null
                ? "bg-transparent"
                : isReferrerValid === false
                ? "border-red-500"
                : "border-green-500"
            } ${fieldErrors.referredBy ? "border-red-500" : ""}`}
            placeholder="0xABC123"
            required
          />
          {fieldErrors.referredBy && <p className="text-red-500 text-sm mt-1 ml-1">{fieldErrors.referredBy}</p>}
          {isReferrerValid === false && (
            <p className="m-0 absolute text-[12px] text-center w-full translate-y-10 text-red-500">Wallet invalida</p>
          )}
        </div>
      </div>
      {/* Terms and Conditions */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="terms"
          name="terms"
          checked={formData.terms}
          onChange={handleChange}
          className={`mr-2 h-4 w-4 rounded focus:ring-blue-500 border-gray-300  ${
            fieldErrors.terms ? "border-red-500" : ""
          }`}
          required
        />
        <label htmlFor="terms" className="text-sm font-medium text-gray-700">
          Acepto los{" "}
          <Link href="/terms" className="text-blue-500 hover:underline">
            Términos y condiciones
          </Link>
        </label>
      </div>
      {fieldErrors.terms && <p className="text-red-500 text-sm mt-1 ml-5">{fieldErrors.terms}</p>}

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
        disabled={
          isSubmitting ||
          !isWalletConnected ||
          !isReferrerValid ||
          !Object.values(passwordCriteria).every(Boolean) ||
          !formData.terms
        }
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed ${
          isSubmitting ||
          !isWalletConnected ||
          !isReferrerValid ||
          !Object.values(passwordCriteria).every(Boolean) ||
          !formData.terms
            ? "bg-gray-500"
            : "bg-gray-900 hover:bg-gray-700"
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
