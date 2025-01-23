import React, { useEffect, useState } from "react";

const TransactionsTable: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/transaction`);
        if (!response.ok) {
          throw new Error("No se pudieron obtener las transacciones.");
        }
        const data = await response.json();
        setTransactions(data.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
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
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Tabla de transacciones agrupadas por usuario</h2>

      {loading ? (
        <p className="text-center text-gray-500">Cargando transacciones...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
            {/* Encabezados */}
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Usuario (Email)</th>
                <th className="px-4 py-2 text-left">Monto</th>
                <th className="px-4 py-2 text-left">Fecha</th>
                <th className="px-4 py-2 text-left">Primer Trimestre</th>
                <th className="px-4 py-2 text-left">Segundo Trimestre</th>
                <th className="px-4 py-2 text-left">Tercer Trimestre</th>
                <th className="px-4 py-2 text-left">Mes de Bono</th>
              </tr>
            </thead>

            {/* Cuerpo de la tabla */}
            <tbody>
              {transactions.length > 0 ? (
                transactions.map(userTransaction => (
                  <tr key={userTransaction.userId} className="border-b hover:bg-gray-50">
                    {/* Columna Usuario */}
                    <td className="px-4 py-2">{userTransaction.userDetails[0]?.email || "No disponible"}</td>

                    {/* Columna Monto */}
                    <td className="px-4 py-2">
                      {userTransaction.transactions.map((transaction: any) => (
                        <p key={transaction._id} className="transaction-monto text-sm text-gray-700">
                          ${transaction.amount.$numberDecimal}
                        </p>
                      ))}
                    </td>

                    {/* Columna Fecha */}
                    <td className="px-4 py-2">
                      {userTransaction.transactions.map((transaction: any) => (
                        <p key={transaction._id} className="transaction-fecha text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      ))}
                    </td>

                    {/* Columna Primer Trimestre */}
                    <td className="px-4 py-2">
                      {userTransaction.transactions.map((transaction: any) => (
                        <p key={transaction._id} className="text-sm">
                          {getTrimestreDaysLeft(transaction.date, 3)}
                        </p>
                      ))}
                    </td>

                    {/* Columna Segundo Trimestre */}
                    <td className="px-4 py-2">
                      {userTransaction.transactions.map((transaction: any) => (
                        <p key={transaction._id} className="text-sm">
                          {getTrimestreDaysLeft(transaction.date, 6)}
                        </p>
                      ))}
                    </td>

                    {/* Columna Tercer Trimestre */}
                    <td className="px-4 py-2">
                      {userTransaction.transactions.map((transaction: any) => (
                        <p key={transaction._id} className="text-sm">
                          {getTrimestreDaysLeft(transaction.date, 9)}
                        </p>
                      ))}
                    </td>

                    {/* Columna Mes de Bono */}
                    <td className="px-4 py-2">
                      {userTransaction.transactions.map((transaction: any) => (
                        <p key={transaction._id} className="text-sm">
                          {getTrimestreDaysLeft(transaction.date, 10)}
                        </p>
                      ))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-4">
                    No hay transacciones disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;
