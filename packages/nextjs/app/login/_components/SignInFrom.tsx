"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiLock, FiMail } from "react-icons/fi";
import { RiEyeLine } from "react-icons/ri";
import { RiEyeCloseLine } from "react-icons/ri";
import { useAccount } from "wagmi";
import { WalletConnectionBtn } from "~~/components/Wallet/WalletConectionBtn";
import { notification } from "~~/utils/scaffold-eth/notification";

export const SignInForm = () => {
  // Show password feature
  const [showpass, setShowpass] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [formData, setFormData] = useState({ email: "", password: "", wallet: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const currentUser = useAccount();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    const currentParams = new URL(window.location.href, window.location.origin);
    const email = currentParams.searchParams.get("email") ?? "";

    if (email && !formData.email) {
      setFormData(prevData => ({ ...prevData, email }));
    }
  }, [formData]);

  useEffect(() => {
    if (errorMessage) {
      notification.error(errorMessage, { position: "bottom-right", duration: 5000 });
      setErrorMessage("");
    }

    if (successMessage) {
      notification.success(successMessage, { position: "bottom-right", duration: 5000 });
      setSuccessMessage("");
    }
  }, [errorMessage, successMessage]);

  const handleConnectWallet = useCallback(async () => {
    setErrorMessage("");
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
          setSuccessMessage("Wallet conectada con éxito.");
          setIsWalletConnected(true);
        } else {
          setErrorMessage("Esta wallet no está registrada.");
          setIsWalletConnected(false);
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Error al verificar la wallet.");
        setIsWalletConnected(false);
      }
    } catch (error) {
      setErrorMessage("No se pudo conectar con el servidor.");
      setIsWalletConnected(false);
    }
  }, [formData.wallet]);

  useEffect(() => {
    if (currentUser.status === "connected") {
      setFormData(prevData => ({ ...prevData, wallet: currentUser.address ?? "" }));
      const checkConnect = setTimeout(() => handleConnectWallet(), 2000);
      return () => clearTimeout(checkConnect);
    }

    if (currentUser.status === "disconnected") {
      setFormData(prevData => ({ ...prevData, wallet: "" }));
    }
  }, [currentUser.status, currentUser.address, handleConnectWallet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    if (!isWalletConnected) {
      setErrorMessage("No tienes conectada una wallet válida.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Error al iniciar sesión.");
      }
    } catch (error) {
      setErrorMessage("No se pudo conectar al servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpClick = () => {
    const email = formData.email;
    const registerUrl = email ? `/register?email=${encodeURIComponent(email)}` : "/register";
    sessionStorage.setItem("allowAccess", "true");
    router.push(registerUrl);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1 relative">
          <input
            type="email"
            id="email"
            autoComplete="username"
            value={formData.email}
            readOnly
            className="block w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none sm:text-sm"
            required
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
            type={showpass ? "type" : "password"}
            id="password"
            autoComplete="current-password"
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
            className="block w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Ingresa tu contraseña"
            required
          />
          <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-auto"
            onClick={e => {
              e.stopPropagation();
              isFocused && setShowpass(!showpass);
            }}
          >
            {!isFocused ? (
              <FiLock className="text-gray-400" />
            ) : showpass ? (
              <div className="tooltip" data-tip="Ocultar contraseña">
                <RiEyeLine className="text-gray-600" />
              </div>
            ) : (
              <div className="tooltip" data-tip="Mostrar contraseña">
                <RiEyeCloseLine className="text-gray-600" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wallet connection */}
      <div>
        <label htmlFor="wallet" className="block text-sm font-medium text-gray-700">
          Wallet
        </label>
        <div className="mt-1 relative flex">
          <WalletConnectionBtn enableWallet={isWalletConnected} classBtn="w-full rounded-md" />
        </div>
      </div>

      {/* Register link */}
      <div className="text-sm text-center">
        <p>
          ¿No tienes una cuenta?{" "}
          <a href="#" className="text-blue-600 hover:text-blue-800" onClick={handleSignUpClick}>
            Regístrate aquí
          </a>
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || !isWalletConnected}
        className={`w-full py-2 px-4 border border-transparent disabled:bg-gray-300 rounded-md shadow-sm text-sm font-medium text-white ${
          isSubmitting || !isWalletConnected ? "bg-gray-500" : "bg-gray-900 hover:bg-gray-700"
        }`}
      >
        {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
      </button>

      {errorMessage && <p className="text-red-600 text-sm mt-2">{errorMessage}</p>}
      {successMessage && <p className="text-green-600 text-sm mt-2">{successMessage}</p>}
    </form>
  );
};
