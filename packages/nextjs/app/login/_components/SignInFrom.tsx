"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { FiLock, FiMail } from "react-icons/fi";
import { RiEyeLine } from "react-icons/ri";
import { RiEyeCloseLine } from "react-icons/ri";
import { useAccount } from "wagmi";
import { WalletConnectionBtn } from "~~/components/Wallet/WalletConectionBtn";
import { useGlobalState } from "~~/services/store/store";
// import { useInitializeMemberStatus } from "~~/hooks/3FProject/useInitializeMemberStatus";
import { notification } from "~~/utils/scaffold-eth/notification";

interface DecodedToken {
  membership: number;
}

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
  const memebershipStatus = useGlobalState(state => state.setIsActiveMemberStatus);

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

  const handleWalletLogin = useCallback(
    async (wallet: string) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wallet }),
        });

        if (response.ok) {
          const data = await response.json();

          localStorage.setItem("token", data.token);
          sessionStorage.setItem("sessionToken", data.token);

          // Update membership status
          const token: DecodedToken = jwtDecode(data.token);
          if (token.membership !== 0) memebershipStatus(true);

          router.push("/dashboard");
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || "Error al iniciar sesión.");
        }
      } catch (error) {
        setErrorMessage("No se pudo conectar al servidor.");
      }
    },
    [memebershipStatus, router],
  );

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
          // Iniciar sesión automáticamente con la wallet conectada
          await handleWalletLogin(formData.wallet);
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
  }, [formData.wallet, handleWalletLogin]);

  useEffect(() => {
    if (currentUser.status === "connected") {
      setFormData(prevData => ({ ...prevData, wallet: currentUser.address ?? "" }));
      const checkConnect = setTimeout(() => handleConnectWallet(), 2000);
      return () => clearTimeout(checkConnect);
    }

    if (currentUser.status === "disconnected") {
      setFormData(prevData => ({ ...prevData, wallet: "" }));
      setIsWalletConnected(false);
    }
  }, [currentUser.status, currentUser.address, handleConnectWallet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    // Confirmar que las credenciales de email y password estén completas
    if (!(formData.email && formData.password)) {
      setErrorMessage("Debe ingresar un correo y contraseña.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem("token", data.token);
        sessionStorage.setItem("sessionToken", data.token);

        // Update membership status
        const token: DecodedToken = jwtDecode(data.token);
        if (token.membership !== 0) memebershipStatus(true);

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

  const handleresetPasswordClick = () => {
    const email = formData.email;
    const registerUrl = email ? `/sendEmailValidate?email=${encodeURIComponent(email)}` : "/sendEmailValidate";
    sessionStorage.setItem("allowAccess", "true");
    router.push(registerUrl);
  };

  return (
    <>
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
              readOnly
              value={formData.email}
              onChange={handleChange}
              className="block w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none sm:text-sm"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FiMail />
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="pb-6">
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
          </div>
          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !(formData.email && formData.password)}
            className={`w-full mt-8 py-2 px-4 border border-transparent disabled:bg-gray-300 rounded-md shadow-sm text-sm font-medium text-white ${
              isSubmitting || !(formData.email && formData.password) ? "bg-gray-500" : "bg-gray-900 hover:bg-gray-700"
            }`}
          >
            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </div>
      </form>

      <div className="relative">
        <hr className="my-8 border-t border-gray-300" />
        <span className="px-2 text-[12px] max-w-34 text-center text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white">
          O accede con tu wallet
        </span>
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

      {/* Reset password link */}
      <div className="text-sm text-center">
        <p>
          ¿Olvidaste tu contraseña?{" "}
          <a href="#" className="text-blue-600 hover:text-blue-800" onClick={handleresetPasswordClick}>
            Recuperala aquí
          </a>
        </p>
      </div>

      {errorMessage && <p className="text-red-600 text-sm mt-2">{errorMessage}</p>}
      {successMessage && <p className="text-green-600 text-sm mt-2">{successMessage}</p>}
    </>
  );
};
