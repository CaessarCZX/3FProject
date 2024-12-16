import React, { useEffect, useState } from "react";
import "./UserModal.css";

interface User {
  name: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
}

interface UserModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ userId, isOpen, onClose }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      console.log("User ID recibido:", userId);
      if (!userId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:3001/f3api/users/${userId}`);
        if (!response.ok) {
          throw new Error("Error al obtener los datos del usuario");
        }
        const data = await response.json();
        console.log("Datos del usuario recibidos:", data.user);

        setUser(data.user);
      } catch (err) {
        console.error("Error al obtener los datos del usuario:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (!isOpen) {
    console.log("El modal no está abierto");
    return null;
  }

  console.log("Modal abierto con userId:", userId);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {loading ? (
          <p>Cargando datos del usuario...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : user ? (
          <>
            <h3>{user.name}</h3>
            <h5>{user.email}</h5>
            <h5>{user.isActive ? "Activo" : "Inactivo"}</h5>
            <h5>{user.isAdmin ? "Administrador" : "Usuario"}</h5>
          </>
        ) : (
          <p>No se encontró información del usuario.</p>
        )}
      </div>
    </div>
  );
};

export default UserModal;
