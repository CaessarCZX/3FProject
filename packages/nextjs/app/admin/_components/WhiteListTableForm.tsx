"use client";

import React, { useEffect, useState } from "react";
import "../_css/AdminTableForm.css";

interface User {
  _id: string;
  email: string;
  isApproved: boolean;
}

const WhiteListTableForm = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching users from API for page ${page}...`);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/whiteList/?page=${page}`);

      if (!response.ok) {
        throw new Error("Error al obtener los usuarios");
      }

      const data = await response.json();
      console.log("Datos obtenidos de la API:", data);

      setUsers(data.users || []);
      setCurrentPage(data.page || 1);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error("Error al obtener los usuarios:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleToggle = async (userId: string, field: "isApproved") => {
    const user = users.find(u => u._id === userId);
    if (!user) {
      console.warn("Usuario no encontrado en el estado local:", userId);
      return;
    }

    const updatedValue = !user[field];
    console.log(`Actualizando ${field} para el usuario ${userId}:`, updatedValue);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/whiteList/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: updatedValue }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el usuario");
      }

      console.log("Usuario actualizado con éxito.");
      setUsers(prevUsers => prevUsers.map(u => (u._id === userId ? { ...u, [field]: updatedValue } : u)));
    } catch (err) {
      console.error("Error al actualizar el usuario:", err);
      alert("Hubo un error al actualizar el usuario. Revisa los logs.");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/whiteList/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar el usuario");
      }

      console.log("Usuario eliminado con éxito.");
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
    } catch (err) {
      console.error("Error al eliminar el usuario:", err);
      alert("Hubo un error al eliminar el usuario. Revisa los logs.");
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className="table-container">
      <h2 className="table-title">Tabla de usuarios</h2>
      {loading ? (
        <p className="loading-text">Cargando usuarios...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user._id}>
                    <td>{user.email}</td>
                    <td>
                      <div className="switch-container">
                        <span className={`status-badge ${user.isApproved ? "active" : "inactive"}`}>
                          {user.isApproved ? "Activo" : "Inactivo"}
                        </span>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={user.isApproved}
                            onChange={() => handleToggle(user._id, "isApproved")}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="delete-button" onClick={() => handleDelete(user._id)}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="no-data">
                    No hay usuarios disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button className="pagination-button" onClick={handlePrevious} disabled={currentPage === 1}>
              ← Anterior
            </button>
            <span className="pagination-info">
              Página {currentPage} de {totalPages}
            </span>
            <button className="pagination-button" onClick={handleNext} disabled={currentPage === totalPages}>
              Siguiente →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WhiteListTableForm;
