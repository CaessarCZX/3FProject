"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { WalletButton } from "@rainbow-me/rainbowkit";
import { FiLock, FiMail, FiUser } from "react-icons/fi";
// import { useAccount } from "wagmi";
import { WalletConnectionBtn } from "~~/components/Wallet/WalletConectionBtn";
import { RenderWarningMessages, validateFormData } from "~~/utils/Form/register";

export const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    wallet: "",
    referredBy: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false); // Validacion de wallet
  const [isReferrerValid, setIsReferrerValid] = useState(false); // Validador de referido
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // const [errors, setErrors] = useState<Record<string, string>>({});

  //For blockchain
  // const currentUser = useAccount();

  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get("email");
    if (email) {
      setFormData(prev => ({ ...prev, email }));
      console.log(errorMessage);
    }
  }, [errorMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Reset validation when "wallet" changes
    if (name === "wallet") {
      setIsWalletConnected(false);
      setErrorMessage("");
      setSuccessMessage("");
    }

    // Reset validation when "referredBy" changes
    if (name === "referredBy") {
      setIsReferrerValid(false);
      setErrorMessage("");
      setSuccessMessage("");
    }
  };

  const handleValidateReferrer = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.referredBy) {
      setErrorMessage("Por favor, introduce una wallet de referido.");
      return;
    }

    try {
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
          setErrorMessage("La wallet de referido no está registrada.");
          setIsReferrerValid(false);
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Error al validar la wallet de referido.");
        setIsReferrerValid(false);
      }
    } catch (error) {
      setErrorMessage("No se pudo conectar con el servidor.");
      setIsReferrerValid(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleConnectWallet();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    // For validations
    const validation = validateFormData(formData);
    if (Object.values(validation).length > 0) {
      RenderWarningMessages(validation);
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
        setFormData({ name: "", email: "", password: "", wallet: "", referredBy: "" });
        setIsWalletConnected(false);
        setIsReferrerValid(false);

        sessionStorage.setItem("allowAccess", "true");
        router.push("/login");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Error en el registro.");
      }
    } catch (error) {
      setErrorMessage("No se pudo conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConnectWallet = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.wallet) {
      setErrorMessage("Por favor, introduce una dirección de wallet.");
      return;
    }

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
          setErrorMessage("Esta wallet ya está registrada.");
          setIsWalletConnected(false); // Deshabilitar el registro si la wallet está registrada
        } else {
          setSuccessMessage("Wallet conectada con éxito.");
          setIsWalletConnected(true); // Habilitar el registro
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Error al verificar la wallet.");
        setIsWalletConnected(false); // Deshabilitar registro si ocurre un error con la wallet
      }
    } catch (error) {
      setErrorMessage("No se pudo conectar con el servidor.");
      setIsWalletConnected(false);
    }
  };

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
          Name
        </label>
        <div className="mt-1 relative">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full pr-10 pl-4 font-light text-gray-700 dark:text-white py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your full name"
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
          Password
        </label>
        <div className="mt-1 relative">
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="block w-full pr-10 pl-4 py-2 font-light text-gray-700 dark:text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your password"
            required
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FiLock />
          </div>
        </div>
      </div>

      {/* Wallet */}
      <div>
        <label htmlFor="wallet" className="block text-sm font-medium text-gray-700">
          Wallet
        </label>
        <div className="mt-1 relative flex">
          <WalletConnectionBtn classBtn="w-full rounded-md" />
          {/* <input
            type="text"
            id="wallet"
            name="wallet"
            value={formData.wallet}
            onChange={handleChange}
            className="block w-full pl-4 pr-20 py-2 font-light text-gray-700 dark:text-white border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="0xABC123"
            required
          />
          <button
            type="button"
            onClick={handleConnectWallet}
            className="px-4 py-2 border border-gray-300 bg-gray-100 rounded-r-md text-sm text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Conectar
          </button> */}
        </div>
      </div>

      {/* Referred Wallet */}
      <div>
        <label htmlFor="referredBy" className="block text-sm font-medium text-gray-700">
          Wallet de Referido
        </label>
        <div className="mt-1 relative flex">
          <input
            type="text"
            id="referredBy"
            name="referredBy"
            value={formData.referredBy}
            onChange={handleChange}
            className="block w-full pl-4 pr-20 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="0xABC123"
            required
          />
          <button
            type="button"
            onClick={handleValidateReferrer}
            className="px-4 py-2 border border-gray-300 bg-gray-100 rounded-r-md text-sm text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Validar
          </button>
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
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          isSubmitting || !isWalletConnected || !isReferrerValid ? "bg-gray-500" : "bg-gray-900 hover:bg-gray-700"
        }`}
      >
        {isSubmitting ? "Registrando..." : "Registrar"}
      </button>

      {/* Mensajes de éxito o error */}
      {successMessage && <p className="text-green-600 text-sm mt-2">{successMessage}</p>}
      {errorMessage && <p className="text-red-600 text-sm mt-2">{errorMessage}</p>}
    </form>
  );
};
