"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TermsAgree from "./TermsAgree";
import { FiLock, FiMail, FiUser } from "react-icons/fi";
import { getAddress, isAddress } from "viem";
import { useAccount, useDisconnect } from "wagmi";
import { BtnLoading, SignBtn } from "~~/components/UI/Button";
import InputField from "~~/components/UI/Input/InputField";
import InputPassword from "~~/components/UI/Input/InputPassword";
import { WalletConnectionBtn } from "~~/components/Wallet/WalletConectionBtn";
import { useShowUiNotifications } from "~~/hooks/3FProject/useShowUiNotifications";
import ApiRateLimiter from "~~/utils/API/ApiRateLimiter";
import { validatePassword } from "~~/utils/Form";
import { RenderWarningMessages, validateFormData } from "~~/utils/Form/register";
import { notification } from "~~/utils/scaffold-eth/notification";

const ETH_WALLET_LENGTH = 42;

const FieldErrorMessage = ({ error }: { error: string }) => (
  <>{error && <p className="text-red-500 text-sm my-0 mx-1">{error}</p>}</>
);

export const SignUpForm = () => {
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    wallet: "",
    referredBy: "",
    terms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isReferrerValid, setIsReferrerValid] = useState<boolean | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    wallet: "",
    referredBy: "",
    terms: "",
  });
  const currentUser = useAccount();
  const { disconnectAsync } = useDisconnect();
  const router = useRouter();
  // Prevent double send
  const [isRegistered, setIsRegistered] = useState(false);

  // Message ui
  useShowUiNotifications({
    success,
    setSuccess,
    error,
    setError,
  });

  // Password validation handler
  useEffect(() => {
    if (password.length === 0) {
      setIsValidPassword(null);
      setFieldErrors(prev => ({ ...prev, password: "" }));
      return;
    }

    if (password) {
      const validateResponse = validatePassword(password);
      setIsValidPassword(validateResponse.length === 0);
      if (validateResponse.length > 0) {
        setFieldErrors(prev => ({ ...prev, password: validateResponse }));
      } else {
        setFieldErrors(prev => ({ ...prev, password: "" }));
      }
    }
  }, [password]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get("email");
    if (email) {
      setFormData(prev => ({ ...prev, email }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Reset validation when "wallet" changes
    if (name === "wallet") {
      setIsWalletConnected(false);
      setFieldErrors(prev => ({ ...prev, wallet: "" }));
    }

    // Reset validation when "referredBy" changes
    if (name === "referredBy") {
      setIsReferrerValid(false);
      setFieldErrors(prev => ({ ...prev, referredBy: "" }));
    }

    // Clear terms error
    if (name === "terms") {
      setFieldErrors(prev => ({ ...prev, terms: "" }));
    }
  };

  // Limitador para llamadas a la API
  const rateLimiter = useRef(new ApiRateLimiter());

  const handleValidateReferrer = useCallback(async () => {
    setError("");
    setSuccess("");

    if (!formData.referredBy) {
      setError("Por favor, introduce una wallet de referido.");
      setFieldErrors(prev => ({ ...prev, referredBy: "Por favor, introduce una wallet de referido." }));
      return;
    }

    // Convert any entered address to valid wallet address
    const validWallet = getAddress(formData.referredBy);

    try {
      await rateLimiter.current.executeWithRateLimit(async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/users/check-wallet`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ wallet: validWallet }),
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.exists) {
            setSuccess("Wallet de referido válida.");
            setIsReferrerValid(true);
            setFieldErrors(prev => ({ ...prev, referredBy: "" }));
          } else {
            setError("La wallet de referido no está registrada.");
            setIsReferrerValid(false);
            setFieldErrors(prev => ({ ...prev, referredBy: "La wallet de referido no está registrada." }));
          }
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Error al validar la wallet de referido.");
          setIsReferrerValid(false);
          setFieldErrors(prev => ({
            ...prev,
            referredBy: errorData.message || "Error al validar la wallet de referido.",
          }));
        }
      });
    } catch (error) {
      setError("No se pudo conectar con el servidor.");
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

  const createUser = async (formData: typeof SignUpForm.prototype.formData, password: string) => {
    // Convert any entered address to valid wallet address
    const validWallet = getAddress(formData.referredBy);

    const registerData = {
      ...formData,
      password,
      referredBy: validWallet,
      isAdmin: false,
      isActive: true,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
      credentials: "include",
    });
    return response;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess("");
    setError("");

    //For wallet connection
    if (!isWalletConnected) {
      setError("No tienes conectada una wallet");
      setFieldErrors(prev => ({ ...prev, wallet: "No tienes conectada una wallet" }));
      setIsSubmitting(true);
      return;
    }

    // For validations
    if (!formData.terms) {
      setFieldErrors(prev => ({ ...prev, terms: "Debes aceptar los términos y condiciones" }));
      setIsSubmitting(false);
      return;
    }

    if (!password || !repeatPassword) {
      setError("Por favor, completa ambos campos.");
      return;
    }
    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const validation = validateFormData(formData);

    if (Object.keys(validation).length > 0) {
      RenderWarningMessages(validation);
      setIsSubmitting(false);
      setFieldErrors(prev => ({ ...prev, ...validation }));
      return;
    }

    try {
      const response = await createUser(formData, password);

      if (response.ok) {
        await sendRegisterEmail(formData.email, formData.name);
        await sendAffiliateEmail(formData.name, formData.email, formData.referredBy);
        setIsRegistered(true);

        // Disconnect current wallet
        await disconnectAsync();

        setSuccess("¡Registro exitoso!");
        const saveEmail = formData.email;
        setFormData({
          name: "",
          email: "",
          wallet: "",
          referredBy: "",
          terms: false,
        });
        setIsWalletConnected(false);
        setIsReferrerValid(false);
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
        setError(errorData.message || "Error en el registro.");
      }
    } catch (error) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConnectWallet = useCallback(async () => {
    setError("");
    setSuccess("");

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
          setError("Esta wallet ya está registrada.");
          setFieldErrors(prev => ({ ...prev, wallet: "Esta wallet ya está registrada." }));
          setIsWalletConnected(false);
        } else {
          setSuccess("Wallet conectada con éxito.");
          setIsWalletConnected(true);
          setFieldErrors(prev => ({ ...prev, wallet: "" }));
        }
      } else {
        const errorData = await response.json();
        setFieldErrors(prev => ({ ...prev, wallet: errorData.message || "Error al verificar la wallet." }));
        setError(errorData.message || "Error al verificar la wallet.");
        setIsWalletConnected(false);
      }
    } catch (error) {
      setError("No se pudo conectar con el servidor.");
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
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2 xl:col-span-1">
          <InputField
            label="Nombre"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            validationState={fieldErrors.name ? "error" : "default"}
            icon={<FiUser />}
          />
          <FieldErrorMessage error={fieldErrors.name} />
        </div>
        {/* Email */}
        <div className="col-span-2 xl:col-span-1">
          <InputField
            label="Email"
            type="email"
            id="email"
            name="email"
            autoComplete="new-username"
            value={formData.email}
            readOnly
            validationState={fieldErrors.email ? "error" : "default"}
            icon={<FiMail />}
          />
          <FieldErrorMessage error={fieldErrors.email} />
        </div>
      </div>
      {/* Password */}
      <div>
        <InputPassword
          label="Contraseña"
          showValidator
          validationState={isValidPassword === null ? "default" : isValidPassword === false ? "error" : "success"}
          enableHelper
          icon={<FiLock />}
          password={password}
          setPassword={setPassword}
        />
        <FieldErrorMessage error={fieldErrors.password} />
      </div>
      <div>
        <InputPassword
          label="Repetir Contraseña"
          validationState={password.length === 0 ? "default" : password !== repeatPassword ? "error" : "success"}
          icon={<FiLock />}
          password={repeatPassword}
          setPassword={setRepeatPassword}
        />
      </div>

      {/* Wallet */}
      <div>
        <label htmlFor="wallet" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
          Wallet
        </label>
        <div className="mt-1 relative flex">
          <WalletConnectionBtn enableWallet={isWalletConnected} classBtn="w-full rounded-md" />
        </div>
        <FieldErrorMessage error={fieldErrors.wallet} />
      </div>

      {/* Referred Wallet */}
      <div>
        <label htmlFor="referredBy" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
          Wallet de Referido
        </label>
        <div className="mt-1 relative">
          <input
            autoComplete="none"
            type="text"
            id="referredBy-item"
            name="referredBy"
            value={formData.referredBy}
            onChange={handleChange}
            className={`block w-full pl-4 pr-20 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-form-strokedark dark:text-whiten ${
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
      <div>
        <TermsAgree
          id="terms"
          name="terms"
          checked={formData.terms}
          changeFunction={handleChange}
          className={fieldErrors.email ? "border-red-500" : ""}
        />
        <FieldErrorMessage error={fieldErrors.terms} />
      </div>

      {/* Login link */}
      <div className="text-sm text-center">
        <p className="m-0">
          ¿Ya tienes una cuenta?{" "}
          <a href="#" className="text-blue-600 hover:text-blue-800" onClick={handleLoginClick}>
            Inicia sesión aquí
          </a>
        </p>
      </div>
      <SignBtn
        type="submit"
        disabled={
          isSubmitting || !isWalletConnected || !isReferrerValid || !isValidPassword || !formData.terms || isRegistered
        }
      >
        <BtnLoading text="Registrar" changeState={isSubmitting || isRegistered} />
      </SignBtn>

      {/* Mensajes de éxito o error */}
      {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </form>
  );
};
