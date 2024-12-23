import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface Transaction {
  _id: string;
  userId: string;
  amount: number;
  date: string;
}

const TransactionDetails: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No se encontró un token de sesión.");
        return;
      }

      try {
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.id;

        setIsLoading(true);
        setError(null);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/transaction/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("No se encontraron transacciones o ocurrió un error.");
        }

        const data = await response.json();
        setTransactions(data.transactions);
      } catch (error) {
        console.error("Error al obtener transacciones:", error);
        setError("No se pudieron obtener las transacciones.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Función para calcular los días restantes hasta cumplir el trimestre
  const getTrimestreDaysLeft = (date: string, targetMonths: number) => {
    const transactionDate = new Date(date);
    const targetDate = new Date(
      transactionDate.getFullYear(),
      transactionDate.getMonth() + targetMonths,
      transactionDate.getDate(),
    );

    const currentDate = new Date();

    if (currentDate >= targetDate) return "Cumplido";

    const diffInMilliseconds = targetDate.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));

    return `${daysLeft} días restantes`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800">Transacciones del Usuario</h2>

        {/* Estado de carga */}
        {isLoading && <p className="text-gray-500 mt-4">Cargando transacciones...</p>}

        {/* Manejo de errores */}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Tabla de transacciones */}
        {transactions && transactions.length > 0 && (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full table-auto border-collapse border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border border-gray-200 text-left text-gray-600 font-semibold">ID</th>
                  <th className="px-4 py-2 border border-gray-200 text-left text-gray-600 font-semibold">Monto</th>
                  <th className="px-4 py-2 border border-gray-200 text-left text-gray-600 font-semibold">Fecha</th>
                  <th className="px-4 py-2 border border-gray-200 text-left text-gray-600 font-semibold">
                    Primer Trimestre
                  </th>
                  <th className="px-4 py-2 border border-gray-200 text-left text-gray-600 font-semibold">
                    Segundo Trimestre
                  </th>
                  <th className="px-4 py-2 border border-gray-200 text-left text-gray-600 font-semibold">
                    Tercer Trimestre
                  </th>
                  <th className="px-4 py-2 border border-gray-200 text-left text-gray-600 font-semibold">
                    Mes de Bono
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr
                    key={transaction._id}
                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                  >
                    {/* Columna ID */}
                    <td className="px-4 py-2 border border-gray-200 text-gray-700">{transaction._id}</td>

                    {/* Columna Monto */}
                    <td className="px-4 py-2 border border-gray-200 text-gray-700">${transaction.amount}</td>

                    {/* Columna Fecha */}
                    <td className="px-4 py-2 border border-gray-200 text-gray-700">
                      {new Date(transaction.date).toLocaleString()}
                    </td>

                    {/* Primer Trimestre */}
                    <td className="px-4 py-2 border border-gray-200 text-gray-700">
                      {getTrimestreDaysLeft(transaction.date, 3)}
                    </td>

                    {/* Segundo Trimestre */}
                    <td className="px-4 py-2 border border-gray-200 text-gray-700">
                      {getTrimestreDaysLeft(transaction.date, 6)}
                    </td>

                    {/* Tercer Trimestre */}
                    <td className="px-4 py-2 border border-gray-200 text-gray-700">
                      {getTrimestreDaysLeft(transaction.date, 9)}
                    </td>

                    {/* Mes de Bono */}
                    <td className="px-4 py-2 border border-gray-200 text-gray-700">
                      {getTrimestreDaysLeft(transaction.date, 10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sin transacciones */}
        {transactions && transactions.length === 0 && (
          <p className="text-gray-500 mt-4">No se encontraron transacciones para este usuario.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionDetails;
