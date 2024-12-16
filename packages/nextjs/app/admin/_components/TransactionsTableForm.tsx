import React, { useEffect, useState } from "react";
import "../_css/TransictionsTableForm.css";

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
    <div className="table-container">
      <h2 className="table-title">Tabla de transacciones agrupadas por usuario</h2>

      {loading ? (
        <p className="loading-text">Cargando transacciones...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <table className="table">
          {/* Encabezados */}
          <thead>
            <tr>
              <th>Usuario (Email)</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Primer Trimestre</th>
              <th>Segundo Trimestre</th>
              <th>Tercer Trimestre</th>
              <th>Mes de Bono</th>
            </tr>
          </thead>

          {/* Cuerpo de la tabla */}
          <tbody>
            {transactions.length > 0 ? (
              transactions.map(userTransaction => (
                <tr key={userTransaction.userId}>
                  {/* Columna Usuario */}
                  <td>{userTransaction.userDetails[0]?.email || "No disponible"}</td>

                  {/* Columna Monto */}
                  <td>
                    {userTransaction.transactions.map((transaction: any) => (
                      <p key={transaction._id} className="transaction-monto">
                        ${transaction.amount}
                      </p>
                    ))}
                  </td>

                  {/* Columna Fecha */}
                  <td>
                    {userTransaction.transactions.map((transaction: any) => (
                      <p key={transaction._id} className="transaction-fecha">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    ))}
                  </td>

                  {/* Columna Primer Trimestre */}
                  <td>
                    {userTransaction.transactions.map((transaction: any) => (
                      <p key={transaction._id}>{getTrimestreDaysLeft(transaction.date, 3)}</p>
                    ))}
                  </td>

                  {/* Columna Segundo Trimestre */}
                  <td>
                    {userTransaction.transactions.map((transaction: any) => (
                      <p key={transaction._id}>{getTrimestreDaysLeft(transaction.date, 6)}</p>
                    ))}
                  </td>

                  {/* Columna Tercer Trimestre */}
                  <td>
                    {userTransaction.transactions.map((transaction: any) => (
                      <p key={transaction._id}>{getTrimestreDaysLeft(transaction.date, 9)}</p>
                    ))}
                  </td>

                  {/* Columna Mes de Bono */}
                  <td>
                    {userTransaction.transactions.map((transaction: any) => (
                      <p key={transaction._id}>{getTrimestreDaysLeft(transaction.date, 10)}</p>
                    ))}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="no-data">
                  No hay transacciones disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionsTable;
