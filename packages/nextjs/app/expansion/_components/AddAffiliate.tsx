"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { notification } from "~~/utils/scaffold-eth/notification";

const AddAffiliate: React.FC = () => {
  const [affiliateEmail, setAffiliateEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string>("");

  const resetMessages = () => {
    setError(null);
    setSuccess("");
  };

  const handleAddAffiliate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    resetMessages();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/whiteList/create-white-list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: affiliateEmail,
          isApproved: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setSuccess(data.message || "Usuario previamente registrado");
          return;
        }

        setError(data.message || "Ocurrió un error inesperado");
        return;
      }

      setSuccess("Prospecto registrado");
      setAffiliateEmail("");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Un error desconocido ha ocurrido";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // For messages to UI
  useEffect(() => {
    if (error !== null) {
      notification.error(error, { position: "top-right", duration: 5000 });
      resetMessages();
    }

    if (success) {
      notification.success(success, { position: "top-right", duration: 5000 });
      resetMessages();
    }
  }, [error, success]);

  return (
    <>
      {/* Campo para referido directo */}
      <div className="md:col-span-3 xl:col-span-4 pb-6">
        <div className="flex bg-white dark:bg-boxdark dark:border-strokedark shadow-default rounded-r-lg">
          <Image
            width={150}
            height={150}
            className="contrast-75"
            src="/vision-images/3-2.png"
            alt="Expansion team FREE"
          />
          <article className="p-6 w-full">
            <h2 className="text-3xl font-light text-gray-500 dark:text-gray-400 mb-4">Añadir prospecto</h2>
            <div>
              <form onSubmit={handleAddAffiliate}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1">Correo</label>
                <div className="flex flex-col sm:flex-row gap-4 xl:gap-8">
                  <input
                    type="email"
                    name="email"
                    value={affiliateEmail}
                    onChange={e => setAffiliateEmail(e.target.value)}
                    placeholder="Correo de nuevo referido"
                    className="flex-1 block px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-form-strokedark dark:text-whiten"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className={`max-w-xs sm:max-w-sm px-6 py-2 text-white rounded-md shadow focus:outline-none 
                      ${
                        loading
                          ? "bg-[#818f8E] dark:bg-blue-900"
                          : "bg-brand-default hover:bg-brand-hover dark:bg-blue-600 dark:hover:bg-blue-700"
                      }`}
                  >
                    {loading ? "Registrando..." : "Crear referido"}
                  </button>
                </div>
              </form>
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

export default AddAffiliate;
