"use client";

import React, { useEffect, useState } from "react";
import "../_css/AdminTableForm.css";
import { jwtDecode } from "jwt-decode";

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
}

interface DecodedToken {
  id: string;
}

const TableForm = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/f3api/users");
        if (!response.ok) {
          throw new Error("Error al obtener los usuarios");
        }
        const data = await response.json();
        console.log("Datos obtenidos de la API:", data);

        setUsers(data.users || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggle = async (userId: string, field: "isActive" | "isAdmin") => {
    try {
      const token = localStorage.getItem("token"); // Suponiendo que el token está en localStorage

      if (token) {
        try {
          const decoded: DecodedToken = jwtDecode(token); // Decodificar el token
          console.log(decoded);
          const currentUserId = decoded.id;

          // Verificar si el usuario actual está intentando modificar su propio campo
          if (userId === currentUserId) {
            alert("No puedes modificar tu propio campo.");
            return;
          }
        } catch (error) {
          console.error("Error al decodificar el token:", error);
        }
      } else {
        console.log("Token no encontrado.");
      }

      // Actualiza el estado local
      setUsers(prevUsers => prevUsers.map(user => (user._id === userId ? { ...user, [field]: !user[field] } : user)));

      // Realizar la actualización en el backend
      const response = await fetch(`http://localhost:3001/f3api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !users.find(user => user._id === userId)?.[field] }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el usuario.");
      }

      console.log(`Campo ${field} actualizado exitosamente para el usuario ${userId}`);
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      setError("No se pudo actualizar el usuario.");
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
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className="switch-container">
                      <span className={`status-badge ${user.isActive ? "active" : "inactive"}`}>
                        {user.isActive ? "Activo" : "Inactivo"}
                      </span>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={user.isActive}
                          onChange={() => handleToggle(user._id, "isActive")}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </td>
                  <td>
                    <div className="switch-container">
                      {user.isAdmin ? "Admin" : "Usuario"}
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={user.isAdmin}
                          onChange={() => handleToggle(user._id, "isAdmin")}
                        />
                        <span className="slider"></span>
                      </label>
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
      )}
    </div>
  );
};

export default TableForm;
