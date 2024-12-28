import { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { notification } from "~~/utils/scaffold-eth";

const ArrowLoader = () => (
  <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      fill="currentColor"
      className="bi bi-arrow-repeat animate-spin opacity-60 transition-opacity hover:opacity-100"
      viewBox="0 0 16 16"
    >
      <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
      <path
        fill-rule="evenodd"
        d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
      />
    </svg>
  </>
);

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
        id="suscribe-free"
        name="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="bg-transparent text-base py-4 px-5 placeholder:text-base placeholder:text-white placeholder:text-opacity-80 focus:outline-none w-full"
        type="email"
        placeholder="Ingresa tu email"
        required
      />
      <button type="submit" disabled={loading} className="text-xl font-semibold duration-500 mx-7">
        {loading ? <ArrowLoader /> : <IoSend className="w-6 h-6 opacity-60 transition-opacity hover:opacity-100" />}
      </button>
    </form>
  );
};
