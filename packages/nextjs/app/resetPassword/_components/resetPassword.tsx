"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiLock } from "react-icons/fi";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import { notification } from "~~/utils/scaffold-eth/notification";

export const ResetPassword = () => {
  // State management
  const [showpass, setShowpass] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [formData, setFormData] = useState({ email: "", newPassword: "", token: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Pre-fill the email and token from URL params
  useEffect(() => {
    const currentParams = new URL(window.location.href, window.location.origin);
    const email = currentParams.searchParams.get("email") ?? "";
    const token = currentParams.searchParams.get("token") ?? "";

    if (email && token) {
      setFormData(prevData => ({ ...prevData, email, token }));
    }
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/users/resetPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Incluye el token y email en la solicitud
      });

      if (response.ok) {
        setSuccessMessage("Contraseña actualizada exitosamente.");
        const saveEmail = formData.email;
        const loginUrl = saveEmail ? `/login?email=${encodeURIComponent(saveEmail)}` : "/login";
        sessionStorage.setItem("allowAccess", "true");
        router.push(loginUrl);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Error al cambiar la contraseña.");
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
            autoComplete="username"
            value={formData.email}
            className="block w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none sm:text-sm"
            required
          />
        </div>
      </div>

      {/* New Password */}
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
          Nueva contraseña
        </label>
        <div className="mt-1 relative">
          <input
            type={showpass ? "text" : "password"}
            id="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => !formData.newPassword && setIsFocused(false)}
            className="block w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Ingresa tu nueva contraseña"
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
              <RiEyeLine className="text-gray-600" />
            ) : (
              <RiEyeCloseLine className="text-gray-600" />
            )}
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 border border-transparent disabled:bg-gray-300 rounded-md shadow-sm text-sm font-medium text-white ${
          isSubmitting ? "bg-gray-500" : "bg-gray-900 hover:bg-gray-700"
        }`}
      >
        {isSubmitting ? "Actualizando contraseña..." : "Actualizar contraseña"}
      </button>

      {errorMessage && <p className="text-red-600 text-sm mt-2">{errorMessage}</p>}
      {successMessage && <p className="text-green-600 text-sm mt-2">{successMessage}</p>}
    </form>
  );
};
