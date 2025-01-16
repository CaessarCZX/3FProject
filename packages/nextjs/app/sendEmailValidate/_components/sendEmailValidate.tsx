"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export const SendEmailValidate = () => {
  const [message, setMessage] = useState("Enviando enlace de recuperación...");
  const [email, setEmail] = useState("");
  const isEmailSent = useRef(false);
  const router = useRouter();

  useEffect(() => {
    console.log("useEffect ejecutado");

    const sendEmail = async (emailToSend: string) => {
      console.log(`Intentando enviar correo a: ${emailToSend}`);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/sendgrid/resetPassword`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailToSend }),
        });

        if (response.ok) {
          setMessage("Correo enviado con éxito.");
          console.log("Correo enviado con éxito");
        } else {
          const data = await response.json();
          setMessage(data.message || "Error al enviar el correo.");
          console.log("Error al enviar correo:", data.message);
        }
      } catch (error) {
        setMessage("No se pudo conectar al servidor.");
        console.log("Error de conexión:", error);
      }
    };

    const currentParams = new URL(window.location.href, window.location.origin);
    const emailFromUrl = currentParams.searchParams.get("email") ?? "";

    console.log(`Correo obtenido de la URL: ${emailFromUrl}`);

    if (emailFromUrl && !isEmailSent.current) {
      console.log("Enviando correo por primera vez...");
      setEmail(emailFromUrl);
      isEmailSent.current = true;
      sendEmail(emailFromUrl);
    } else if (!emailFromUrl) {
      setMessage("No se proporcionó un correo electrónico válido.");
      console.log("No se encontró un correo electrónico en la URL");
    } else {
      console.log("Correo ya fue enviado previamente");
    }
  }, []);

  // Función para manejar el clic en el enlace de registro
  const handleLoginClick = () => {
    const loginUrl = email ? `/login?email=${encodeURIComponent(email)}` : "/login";
    sessionStorage.setItem("allowAccess", "true");
    router.push(loginUrl);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-whiten">Validación de correo</h1>
      <p className="mt-2 text-base md:text-sm text-gray-600 dark:text-gray-400">{message}</p>
      {/* Muestra el mensaje solo si el correo fue enviado con éxito */}
      {message === "Correo enviado con éxito." && email && (
        <center>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Revisa tu bandeja de entrada en <strong>{email}</strong>.
          </p>
        </center>
      )}

      {/* Login link */}
      <div className="text-sm text-center">
        <p>
          <a href="#" className="text-blue-600 hover:text-blue-800" onClick={handleLoginClick}>
            Regresar a la pagina anterior
          </a>
        </p>
      </div>
    </div>
  );
};
