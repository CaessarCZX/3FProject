"use client";

import React, { useEffect, useState } from "react";
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
      <div className="pb-6">
        <div className=" bg-white dark:bg-boxdark dark:border-strokedark shadow-md rounded-lg p-6">
          <h2 className="text-3xl font-light text-gray-500 dark:text-gray-400 mb-4">Añadir prospecto</h2>
          <div>
            <form onSubmit={handleAddAffiliate}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1">Correo</label>
              <div className="flex max-h-13 gap-8">
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
                  className={`max-w-55 px-6 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 focus:outline-none
                    ${loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"}`}
                >
                  {loading ? "Registrando..." : "Crear referido"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAffiliate;
