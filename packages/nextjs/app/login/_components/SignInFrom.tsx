"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiLock, FiMail } from "react-icons/fi";
import { useAccount } from "wagmi";
import { WalletConnectionBtn } from "~~/components/Wallet/WalletConectionBtn";
import { notification } from "~~/utils/scaffold-eth/notification";

export const SignInForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "", wallet: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const currentUser = useAccount();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Mensajes a ui
  useEffect(() => {
    if (errorMessage) {
      notification.error(errorMessage, { position: "bottom-right", duration: 5000 }); // Muestra la notificicacion con el error encontrado
      setErrorMessage(""); // Borra el mensaje de error registrado
    }

    if (successMessage) {
      notification.success(successMessage, { position: "bottom-right", duration: 5000 });
      setSuccessMessage("");
    }
  }, [errorMessage, successMessage]);

  const handleConnectWallet = useCallback(async () => {
    setErrorMessage("");
    setSuccessMessage("");

    // if (!formData.wallet) {
    //   setSingleErrorMessage("Por favor, introduce una dirección de wallet.");
    //   return;
    // }

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
  }, [formData.wallet]);

  // Para obtener direccion automatica de wallet conectada
  useEffect(() => {
    if (currentUser.status === "connected") {
      setFormData(prevData => ({ ...prevData, wallet: currentUser.address ?? "" }));
      setTimeout(() => handleConnectWallet(), 2000);
    }

    if (currentUser.status === "disconnected") setFormData(prevData => ({ ...prevData, wallet: "" }));
  }, [currentUser.status, currentUser.address, handleConnectWallet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Token JWT:", data.token);

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

  // Función para manejar el clic en el enlace de registro
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
          Password
        </label>
        <div className="mt-1 relative">
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="block w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your password"
            required
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FiLock />
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
      {/* Wallet connection */}

      {/* Register link */}
      <div className="text-sm text-center">
        <p>
          ¿No tienes una cuenta?{" "}
          <a href="#" className="text-blue-600 hover:text-blue-800" onClick={handleSignUpClick}>
            Registrate aquí
          </a>
        </p>
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isSubmitting ? "bg-gray-500" : "bg-gray-900 hover:bg-gray-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {isSubmitting ? "Cargando..." : "INGRESAR AHORA"}
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && <p className="text-red-600 text-sm mt-2">{errorMessage}</p>}
    </form>
  );
};
