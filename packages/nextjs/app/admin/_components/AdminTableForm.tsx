import React, { useEffect, useState } from "react";
import UserModal from "../_modal/UserModal";
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
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas

  const fetchUsers = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/users?page=${page}`);
      if (!response.ok) {
        throw new Error("Error al obtener los usuarios");
      }
      const data = await response.json();
      setUsers(data.users || []);
      setCurrentPage(data.page || 1); // Actualiza la página actual desde la respuesta
      setTotalPages(data.pages || 1); // Actualiza el total de páginas desde la respuesta
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage); // Llama a fetchUsers cada vez que cambia la página
  }, [currentPage]);

  const handleToggle = async (userId: string, field: "isActive" | "isAdmin") => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const decoded: DecodedToken = jwtDecode(token);
        const currentUserId = decoded.id;

        // Verificar si el usuario actual está intentando modificar su propio campo
        if (userId === currentUserId) {
          alert("No puedes modificar tu propio campo.");
          return;
        }
      }

      setUsers(prevUsers => prevUsers.map(user => (user._id === userId ? { ...user, [field]: !user[field] } : user)));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/users/${userId}`, {
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

  const openModal = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUserId(null);
    setIsModalOpen(false);
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
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Tabla de usuarios</h2>
      {loading ? (
        <p className="text-center text-gray-500">Cargando usuarios...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Nombre</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Estado</th>
                  <th className="px-4 py-2 text-left">Rol</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map(user => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td onClick={() => openModal(user._id)} className="px-4 py-2 cursor-pointer text-blue-600">
                        {user.name}
                      </td>
                      <td onClick={() => openModal(user._id)} className="px-4 py-2 cursor-pointer text-blue-600">
                        {user.email}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center">
                          <span className={`text-sm ${user.isActive ? "text-green-500" : "text-red-500"}`}>
                            {user.isActive ? "Activo" : "Inactivo"}
                          </span>
                          <label className="ml-2 inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={user.isActive}
                              onChange={() => handleToggle(user._id, "isActive")}
                              className="form-checkbox text-indigo-600"
                            />
                          </label>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center">
                          {user.isAdmin ? "Admin" : "Usuario"}
                          <label className="ml-2 inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={user.isAdmin}
                              onChange={() => handleToggle(user._id, "isAdmin")}
                              className="form-checkbox text-indigo-600"
                            />
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-500 py-4">
                      No hay usuarios disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-4">
            <div className="flex justify-center md:justify-start mb-4 md:mb-0">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:bg-gray-200"
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                ← Anterior
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:bg-gray-200 ml-4"
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                Siguiente →
              </button>
            </div>
            <span className="text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
          </div>
        </>
      )}
      <UserModal userId={selectedUserId} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default TableForm;
