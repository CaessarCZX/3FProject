"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const SendEmailValidate = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Este useEffect obtiene el email de la URL
  useEffect(() => {
    const currentParams = new URL(window.location.href, window.location.origin);
    const emailFromUrl = currentParams.searchParams.get("email") ?? "";

    if (emailFromUrl && !email) {
      setEmail(emailFromUrl);
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/sendgrid/resetPassword`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        setMessage("Correo enviado. Revisa tu bandeja de entrada.");
      } else {
        const data = await response.json();
        setMessage(data.message || "Error al enviar el correo.");
      }
    } catch (error) {
      setMessage("No se pudo conectar al servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        readOnly
        className="block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-500"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 text-white ${isSubmitting ? "bg-gray-500" : "bg-blue-600"}`}
      >
        {isSubmitting ? "Enviando..." : "Enviar enlace de recuperación"}
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </form>
  );
};
