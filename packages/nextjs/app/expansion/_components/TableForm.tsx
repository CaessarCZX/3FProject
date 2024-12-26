"use client";

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface UplineCommission {
  wallet: string;
  name: string;
  email: string;
}

const TableForm: React.FC = () => {
  const [uplineCommissions, setUplineCommissions] = useState<UplineCommission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUplineCommissions = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Error: No se encontró un token de sesión.");
        setError("No se encontró un token de sesión.");
        setIsLoading(false);
        return;
      }

      try {
        const decodedToken: any = jwtDecode(token);
        const userWallet = decodedToken.wallet;

        if (!userWallet) {
          console.error("Error: No se encontró la wallet del usuario en el token.");
          setError("No se encontró la wallet del usuario en el token.");
          setIsLoading(false);
          return;
        }

        const url = `${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/users/upline/${userWallet}`;
        console.log("Realizando solicitud a:", url);

        const response = await fetch(url, { method: "GET" });

        console.log("Respuesta del servidor:", response);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al obtener las comisiones.");
        }

        const data = await response.json();
        console.log("Datos obtenidos:", data);

        setUplineCommissions(data.uplineCommissions || []);
      } catch (error: any) {
        console.error("Error al obtener las comisiones:", error);
        setError(error.message || "Error inesperado.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUplineCommissions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800">Upline Commissions</h2>

        {isLoading ? (
          <p className="text-gray-500 mt-4">Cargando datos...</p>
        ) : error ? (
          <p className="text-red-500 mt-4">{error}</p>
        ) : (
          <table className="min-w-full mt-6 border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Wallet</th>
                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {uplineCommissions.length > 0 ? (
                uplineCommissions.map((upline, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2 text-center">{upline.wallet}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{upline.name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{upline.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center" colSpan={3}>
                    No se encontraron comisiones.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TableForm;
