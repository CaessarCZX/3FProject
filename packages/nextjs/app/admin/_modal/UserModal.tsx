import React, { useEffect, useState } from "react";

interface UserModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  _id: string;
  name: string;
  email: string;
  wallet: string;
  isActive: boolean;
  isAdmin: boolean;
  referrals: string[];
  uplineCommisions: string[];
}

const UserModal: React.FC<UserModalProps> = ({ userId, isOpen, onClose }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/users/${userId}`);
        if (!response.ok) {
          throw new Error("Error al obtener los datos del usuario");
        }
        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchUser();
    }
  }, [userId, isOpen]);

  if (!isOpen) {
    return null;
  }

  const renderActiveStatus = (isActive: boolean) => (isActive ? "Activo" : "Inactivo");
  const renderAdminStatus = (isAdmin: boolean) => (isAdmin ? "Sí" : "No");

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-3xl transform transition-all duration-300">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Detalles del Usuario</h2>

        {/* Cargando y Error */}
        {loading && <p className="text-center text-gray-500">Cargando...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Datos del Usuario */}
        {user ? (
          <div>
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>ID:</strong> {user._id}
              </p>
              <p className="text-gray-700">
                <strong>Nombre:</strong> {user.name}
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-gray-700">
                <strong>Billetera:</strong>
                <span className="block sm:inline-block text-sm break-words">{user.wallet}</span>
              </p>
              <p className="text-gray-700">
                <strong>Estado:</strong> {renderActiveStatus(user.isActive)}
              </p>
              <p className="text-gray-700">
                <strong>Administrador:</strong> {renderAdminStatus(user.isAdmin)}
              </p>
            </div>

            {/* Referencias */}
            <h3 className="mt-6 font-semibold text-lg text-gray-800">Referencias:</h3>
            {user.referrals.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                {user.referrals.map((referral, index) => (
                  <li key={index} className="break-words">
                    {referral}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No hay referencias.</p>
            )}

            {/* Comisiones de Upline */}
            <h3 className="mt-6 font-semibold text-lg text-gray-800">Comisiones de Upline:</h3>
            {user.uplineCommisions.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                {user.uplineCommisions.map((uplineCommision, index) => (
                  <li key={index}>{uplineCommision}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No hay comisiones de upline.</p>
            )}
          </div>
        ) : (
          !loading && !error && <p className="text-gray-700 text-center">No se encontró el usuario.</p>
        )}

        {/* Botón centrado */}
        <div className="flex justify-center mt-6">
          <button
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105"
            onClick={onClose}
          >
            Cerrar Modal
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
