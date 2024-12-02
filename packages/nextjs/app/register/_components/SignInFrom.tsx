"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { WalletButton } from "@rainbow-me/rainbowkit";
import { FiLock, FiMail, FiUser } from "react-icons/fi";
import { useAccount } from "wagmi";
import { WalletConnectionBtn } from "~~/components/Wallet/WalletConectionBtn";
import { RenderWarningMessages, validateFormData } from "~~/utils/Form/register";

export const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    wallet: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [singleErrorMessage, setSingleErrorMessage] = useState("");
  // const [errors, setErrors] = useState<Record<string, string>>({});

  //For blockchain
  const currentUser = useAccount();

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Validacion en tiempo real para los campos
    // const error = validateField(name, value);
    // if (error)
    //   notification.warning(error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setSingleErrorMessage("");

    // For validations
    const validation = validateFormData(formData);
    if (Object.values(validation).length > 0) {
      RenderWarningMessages(validation);
    }

    try {
      const response = await fetch("http://localhost:3001/f3api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        setSuccessMessage("¡Registro exitoso! Redirigiendo...");
        setFormData({ name: "", email: "", password: "", wallet: "" });

        // Redirige al usuario a "dashboard" después de 2 segundos
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
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

  // For wallet address detection
  useEffect(() => {
    if (currentUser.status === "connected") {
      setFormData(prevData => ({ ...prevData, wallet: currentUser.address ?? "" }));
    }

    if (currentUser.status === "disconnected") {
      setFormData(prevData => ({ ...prevData, wallet: "" }));
    }
  }, [currentUser.address, currentUser.status]);

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
            onChange={handleChange}
            className="block w-full pr-10 pl-4 font-light text-gray-700 dark:text-white py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your email"
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
            // readOnly
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

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          isSubmitting ? "bg-gray-500" : "bg-gray-900 hover:bg-gray-700"
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
