import React, { useEffect, useState } from "react";
import "../_css/TransictionsTableForm.css";

const TransactionsAdminTableForm: React.FC = () => {
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
              <th>Monto (92%)</th>
              <th>Fecha</th>
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
                        ${Math.round(transaction.amount * 0.92 * 100) / 100}
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

export default TransactionsAdminTableForm;
