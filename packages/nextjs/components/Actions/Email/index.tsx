import { useEffect, useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { notification } from "~~/utils/scaffold-eth";

export const SubscribeForm = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/whiteList/create-white-list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          isApproved: false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409 && data.redirect) {
          // Permiti acceso a login y register
          sessionStorage.setItem("allowAccess", "true");

          // Redirige al login con el email
          const url = new URL(data.redirect, window.location.origin);
          url.searchParams.append("email", email);
          window.location.href = url.toString();
          return;
        }

        setError(data.message || "Ocurrió un error inesperado");
        return;
      }

      setSuccess(true);
      setEmail("");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetMessages = () => {
    setError(null);
    setSuccess(false);
  };

  // For messages to UI
  useEffect(() => {
    if (error !== null) {
      notification.error(error, { position: "top-right", duration: 5000 });
      resetMessages();
    }

    if (success) {
      notification.success("Suscripción completada, espera la validación!", { position: "top-right", duration: 5000 });
      resetMessages();
    }
  }, [error, success]);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white bg-opacity-10 rounded-[50px] overflow-hidden text-white flex flex-grow items-center mt-6 md:max-w-[500px]"
    >
      <input
        name="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="bg-transparent text-base py-4 px-5 placeholder:text-base placeholder:text-white placeholder:text-opacity-80 focus:outline-none w-full"
        type="email"
        placeholder="Ingresa tu email"
        required
      />
      <button type="submit" disabled={loading} className="text-xl font-semibold duration-500 hover:text-blue-600 mr-7">
        {loading ? "Loading..." : <PaperAirplaneIcon className="w-8 h-8 opacity-60" />}
      </button>
    </form>
  );
};
