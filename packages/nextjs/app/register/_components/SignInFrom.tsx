"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiLock, FiMail, FiUser } from "react-icons/fi";

export const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    wallet: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false); // Validacion de wallet
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

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
        setIsWalletConnected(false); // Resetear la bandera después del registro

        // Redirige al usuario a "login" después de 2 segundos
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
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
      const response = await fetch("http://localhost:3001/f3api/users/check-wallet", {
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
            className="block w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
            className="block w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
            className="block w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
          <input
            type="text"
            id="wallet"
            name="wallet"
            value={formData.wallet}
            onChange={handleChange}
            className="block w-full pl-4 pr-20 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="0xABC123"
            required
          />
          <button
            type="button"
            onClick={handleConnectWallet}
            className="px-4 py-2 border border-gray-300 bg-gray-100 rounded-r-md text-sm text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Conectar
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || !isWalletConnected} // Deshabilitado si no se conectó la wallet
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          isSubmitting || !isWalletConnected ? "bg-gray-500" : "bg-gray-900 hover:bg-gray-700"
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
