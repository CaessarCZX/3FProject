import React, { useEffect, useState } from "react";

interface User {
  _id: string;
  email: string;
  isApproved: boolean;
}

const WhiteListTableForm = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas

  const fetchUsers = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/whiteList/?page=${page}`);
      if (!response.ok) {
        throw new Error("Error al obtener los usuarios");
      }
      const data = await response.json();
      setUsers(data.users || []);
      setCurrentPage(data.page || 1);
      setTotalPages(data.pages || 1);
    } catch (err) {
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
    if (!user) return;

    const updatedValue = !user[field];

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/whiteList/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: updatedValue }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el usuario.");
      }

      setUsers(prevUsers => prevUsers.map(u => (u._id === userId ? { ...u, [field]: updatedValue } : u)));
    } catch (err) {
      alert("Hubo un error al actualizar el usuario.");
    }
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/whiteList/${userId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Error al eliminar el usuario");
        }

        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      } catch (err) {
        alert("Hubo un error al eliminar el usuario.");
      }
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
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Lista Blanca de Usuarios</h2>
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
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Estado</th>
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map(user => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center">
                          <span className={`text-sm ${user.isApproved ? "text-green-500" : "text-red-500"}`}>
                            {user.isApproved ? "Activo" : "Inactivo"}
                          </span>
                          <label className="ml-2 inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={user.isApproved}
                              onChange={() => handleToggle(user._id, "isApproved")}
                              className="form-checkbox text-indigo-600"
                            />
                          </label>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <button onClick={() => handleDelete(user._id)} className="text-red-500 hover:text-red-700">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center text-gray-500 py-4">
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
    </div>
  );
};

export default WhiteListTableForm;
