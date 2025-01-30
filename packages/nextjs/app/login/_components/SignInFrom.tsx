"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { FiLock, FiMail } from "react-icons/fi";
import { useAccount } from "wagmi";
import { BtnLoading, SignBtn } from "~~/components/UI/Button";
import InputField from "~~/components/UI/Input/InputField";
import InputPassword from "~~/components/UI/Input/InputPassword";
import { WalletConnectionBtn } from "~~/components/Wallet/WalletConectionBtn";
import { useShowUiNotifications } from "~~/hooks/3FProject/useShowUiNotifications";
import { useGlobalState } from "~~/services/store/store";

interface DecodedToken {
  membership: number;
}

export const SignInForm = () => {
  const [formData, setFormData] = useState({ email: "", wallet: "" });
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const memebershipStatus = useGlobalState(state => state.setIsActiveMemberStatus);
  // Prevent double send
  const [isLogged, setIsLogged] = useState(false);

  const currentUser = useAccount();

  // Message ui
  useShowUiNotifications({
    success,
    setSuccess,
    error,
    setError,
  });

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
          setIsLogged(true);

          // Update membership status
          const token: DecodedToken = jwtDecode(data.token);
          if (token.membership !== 0) memebershipStatus(true);

          router.push("/home");
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Error al iniciar sesión.");
        }
      } catch (error) {
        setError("No se pudo conectar al servidor.");
      }
    },
    [memebershipStatus, router],
  );

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
          setSuccess("Wallet conectada con éxito.");
          setIsWalletConnected(true);
          // Iniciar sesión automáticamente con la wallet conectada
          await handleWalletLogin(formData.wallet);
        } else {
          setError("Esta wallet no está registrada.");
          setIsWalletConnected(false);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error al verificar la wallet.");
        setIsWalletConnected(false);
      }
    } catch (error) {
      setError("No se pudo conectar con el servidor.");
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
    setError("");

    if (!(formData.email && password)) {
      setError("Debe ingresar un correo y contraseña.");
      setIsSubmitting(false);
      return;
    }

    const loginData = {
      ...formData,
      password,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem("token", data.token);
        sessionStorage.setItem("sessionToken", data.token);
        setIsLogged(true);

        // Update membership status
        const token: DecodedToken = jwtDecode(data.token);
        if (token.membership !== 0) memebershipStatus(true);

        router.push("/home");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error al iniciar sesión.");
      }
    } catch (error) {
      setError("No se pudo conectar al servidor.");
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
        <InputField
          label="Email"
          type="email"
          id="email"
          autoComplete="username"
          readOnly
          value={formData.email}
          onChange={handleChange}
          icon={<FiMail />}
        />

        {/* Password */}
        <div className="pb-6">
          <InputPassword label="Contraseña" icon={<FiLock />} password={password} setPassword={setPassword} />
          {/* Submit */}
          <SignBtn className="mt-8" type="submit" disabled={isSubmitting || !(formData.email && password) || isLogged}>
            <BtnLoading text="Iniciar sesión" changeState={isSubmitting || isLogged} />
          </SignBtn>
        </div>
      </form>

      <div className="relative">
        <hr className="my-8 border-t border-gray-300" />
        <span className="px-2 text-[12px] max-w-34 text-center text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-boxdark-2">
          O accede con tu wallet
        </span>
      </div>

      {/* Wallet connection */}
      <div>
        <label htmlFor="wallet" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
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

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
    </>
  );
};
