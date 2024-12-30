import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useDisconnect } from "wagmi";
import { useGlobalState } from "~~/services/store/store";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  name_beneficiary?: string;
  email_beneficiary?: string;
}

const SettingsForm: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [beneficiary, setBeneficiary] = useState({
    name: "",
    email: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { disconnect } = useDisconnect(); // For blockchain
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        setUserInfo({
          id: decodedToken.id || "12345",
          name: decodedToken.name || "Alexis Lopez",
          email: decodedToken.email || "alexis@example.com",
          name_beneficiary: decodedToken.name_beneficiary,
          email_beneficiary: decodedToken.email_beneficiary,
        });
      } catch (error) {
        console.error("Error al decodificar el token", error);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBeneficiary(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveBeneficiary = async () => {
    if (!beneficiary.name || !beneficiary.email) {
      alert("Por favor complete todos los campos.");
      return;
    }

    setIsSaving(true);

    try {
      if (!userInfo) {
        throw new Error("No se encontró el usuario.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/users/${userInfo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name_beneficiary: beneficiary.name,
          email_beneficiary: beneficiary.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el beneficiario.");
      }

      console.log("Beneficiario actualizado exitosamente:", beneficiary);
      localStorage.removeItem("token"); // Cerrar sesión
      useGlobalState.persist.clearStorage(); //Limpiar state local
      disconnect(); // Desconectar wallet
      router.replace("/login");
      alert("Beneficiario actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar el beneficiario:", error);
      setError("No se pudo actualizar el beneficiario.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-3xl font-light text-gray-500">General</h2>

        {/* Información del Usuario */}
        {userInfo ? (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700">Información Personal</h3>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={userInfo.name}
                  readOnly
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm bg-gray-100 text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Correo</label>
                <input
                  type="text"
                  value={userInfo.email}
                  readOnly
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm bg-gray-100 text-gray-700"
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Cargando información del usuario...</p>
        )}

        {/* Formulario para Beneficiario */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-700">Agregar Beneficiario</h3>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="name"
                value={beneficiary.name || userInfo?.name_beneficiary || ""}
                onChange={handleInputChange}
                placeholder="Nombre del beneficiario"
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                readOnly={!!userInfo?.name_beneficiary}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Correo</label>
              <input
                type="email"
                name="email"
                value={beneficiary.email || userInfo?.email_beneficiary || ""}
                onChange={handleInputChange}
                placeholder="Correo del beneficiario"
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                readOnly={!!userInfo?.email_beneficiary}
              />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSaveBeneficiary}
              disabled={isSaving || !!userInfo?.email_beneficiary}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 focus:outline-none"
            >
              {isSaving ? "Guardando..." : "Guardar Beneficiario"}
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default SettingsForm;
