import { useEffect, useState } from "react";
import { CheckCircleIcon, ExclamationCircleIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";

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
      const response = await fetch("http://localhost:3001/f3api/whiteList/create-white-list", {
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

          // Redirige al login
          window.location.href = data.redirect;
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

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(false);
      }, 5500);

      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="relative">
      {/* Mensajes de error y éxito */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-sm py-2 px-4 rounded-lg shadow-md flex items-center gap-2 z-50">
          <ExclamationCircleIcon className="w-5 h-5" />
          {error}
        </div>
      )}
      {success && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-sm py-2 px-4 rounded-lg shadow-md flex items-center gap-2 z-50">
          <CheckCircleIcon className="w-5 h-5" />
          Suscripción completada, espera la validación!
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-10 rounded-[50px] overflow-hidden text-white flex flex-grow items-center mt-6 md:max-w-[500px]"
      >
        <input
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="bg-transparent py-4 px-5 placeholder:text-lg placeholder:text-white placeholder:text-opacity-80 focus:outline-none w-full"
          type="email"
          placeholder="Enter email"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="text-xl font-semibold duration-500 hover:text-blue-600 mr-7"
        >
          {loading ? "Loading..." : <PaperAirplaneIcon className="w-8 h-8 opacity-60" />}
        </button>
      </form>
    </div>
  );
};
