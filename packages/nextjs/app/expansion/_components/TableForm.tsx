"use client";

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface Referral {
  wallet: string;
  name: string;
  email: string;
  parentWallet: string; // Relación con el nivel anterior
}

interface ReferersCommissions {
  level: number;
  referrals: Referral[];
}

const TableForm: React.FC = () => {
  const [referersCommissions, setReferersCommissions] = useState<ReferersCommissions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferersCommissions = async () => {
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

        const url = `${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/users/referers/${userWallet}`;
        console.log("Realizando solicitud a:", url);

        const response = await fetch(url, { method: "GET" });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al obtener las comisiones.");
        }

        const data = await response.json();
        console.log("Datos obtenidos:", data);

        if (Array.isArray(data.ReferersCommissions)) {
          setReferersCommissions(data.ReferersCommissions);
        } else {
          setError("Los datos de comisiones no son válidos.");
        }
      } catch (error: any) {
        console.error("Error al obtener las comisiones:", error);
        setError("Ocurrió un error al obtener los referidos. Intenta de nuevo más tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferersCommissions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800">Referidos</h2>

        {isLoading ? (
          <p className="text-gray-500 mt-4">Cargando datos...</p>
        ) : error ? (
          <p className="text-red-500 mt-4">{error}</p>
        ) : (
          <div>
            {referersCommissions.map(commission => (
              <div key={commission.level} className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700">Nivel {commission.level}</h3>
                <table className="min-w-full mt-2 border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Wallet</th>
                      <th className="border border-gray-300 px-4 py-2">Nombre</th>
                      <th className="border border-gray-300 px-4 py-2">Email</th>
                      <th className="border border-gray-300 px-4 py-2">Pertenece a</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commission.referrals.length > 0 ? (
                      commission.referrals.map(referral => (
                        <tr key={`${commission.level}-${referral.wallet}`}>
                          <td className="border border-gray-300 px-4 py-2 text-center">{referral.wallet}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{referral.name}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{referral.email}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{referral.parentWallet}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 text-center" colSpan={4}>
                          No se encontraron referidos en este nivel.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TableForm;
