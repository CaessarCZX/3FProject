"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiLock, FiMail } from "react-icons/fi";
import { WalletConnectionBtn } from "~~/components/Wallet/WalletConectionBtn";

export const SignInForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:3001/f3api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Token JWT:", data.token);

        // Guarda el token en localStorage o sessionStorage
        localStorage.setItem("token", data.token);

        // Redirige al usuario (por ejemplo, a un dashboard)
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
          <WalletConnectionBtn classBtn="w-full rounded-md" />
        </div>
      </div>
      {/* Wallet connection */}

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
