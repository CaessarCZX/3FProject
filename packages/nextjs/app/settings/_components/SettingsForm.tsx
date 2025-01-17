import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDisconnect } from "wagmi";
import { useGetTokenData } from "~~/hooks/user/useGetTokenData";
import { useGlobalState } from "~~/services/store/store";

const SettingsForm: React.FC = () => {
  const { tokenInfo } = useGetTokenData();
  const [beneficiary, setBeneficiary] = useState({
    name: tokenInfo.name_beneficiary || "",
    email: tokenInfo.email_beneficiary || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditingBeneficiary, setIsEditingBeneficiary] = useState(false);
  const { disconnect } = useDisconnect(); // For blockchain
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBeneficiary(prev => ({ ...prev, [name]: value }));
  };

  const handleEditBeneficiary = () => {
    setIsEditingBeneficiary(true);
  };

  const handleSaveBeneficiary = async () => {
    if (!beneficiary.name || !beneficiary.email) {
      alert("Por favor complete todos los campos.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/users/${tokenInfo.id}`, {
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
      setIsEditingBeneficiary(false);
    }
  };

  return (
    <div>
      <div className="mx-auto bg-white dark:bg-boxdark dark:border-strokedark shadow-default rounded-lg p-6">
        <h2 className="text-3xl font-light text-gray-500 dark:text-gray-400">General</h2>

        {/* Información del Usuario */}
        {tokenInfo ? (
          <>
            <div className="mt-6">
              <h3 className="text-lg text-right font-medium text-gray-700 dark:text-gray-500">Información Personal</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-500">Nombre</label>
                  <input
                    type="text"
                    value={tokenInfo.name}
                    readOnly
                    className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm bg-gray-100 text-gray-700 dark:bg-form-strokedark dark:text-whiten cursor-default"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-500">Correo</label>
                  <input
                    type="text"
                    value={tokenInfo.email}
                    readOnly
                    className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm bg-gray-100 text-gray-700 dark:bg-form-strokedark dark:text-whiten cursor-default"
                  />
                </div>
              </div>
            </div>

            {/* Para wallet registrada */}
            <div className="mt-8">
              <h2 className="text-3xl font-light text-gray-500 dark:text-gray-400 mb-4">Wallet</h2>
              <div>
                <form>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1">
                    Wallet para retiro
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                    <input
                      type="text"
                      name="walletRecipient"
                      value={tokenInfo.wallet}
                      readOnly
                      placeholder="Correo de nuevo referido"
                      className="flex-1 block px-4 py-2 border rounded-md bg-gray-100 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-form-strokedark dark:text-whiten cursor-default"
                    />
                    <button
                      type="submit"
                      disabled
                      className={`max-w-xs sm:max-w-sm transition-colors px-6 py-2 bg-gray-400 dark:bg-gray-600 text-white rounded-md shadow-default cursor-not-allowed focus:outline-none `}
                    >
                      Confirmar wallet
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Cargando información del usuario...</p>
        )}

        {/* Formulario para Beneficiario */}
        <div className="mt-8">
          <h2 className="text-3xl font-light text-gray-500 dark:text-gray-400 mb-4">Beneficiario</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="name"
                value={beneficiary.name}
                onChange={handleInputChange}
                placeholder="Nombre del beneficiario"
                className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-form-strokedark dark:text-whiten ${
                  isEditingBeneficiary ? "" : "bg-gray-100 dark:bg-form-strokedark dark:text-whiten"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Correo</label>
              <input
                type="email"
                name="email"
                value={beneficiary.email}
                onChange={handleInputChange}
                placeholder="Correo del beneficiario"
                className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-form-strokedark dark:text-whiten ${
                  isEditingBeneficiary ? "" : "bg-gray-100 dark:bg-form-strokedark dark:text-whiten"
                }`}
              />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSaveBeneficiary}
              disabled={isSaving || !isEditingBeneficiary}
              className="px-6 py-2 bg-brand-default hover:bg-brand-hover dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-md shadow focus:outline-none"
            >
              {isSaving ? "Guardando..." : "Guardar Beneficiario"}
            </button>
            <button
              onClick={handleEditBeneficiary}
              disabled={isSaving}
              className="ml-4 px-6 py-2 bg-gray-400 dark:bg-gray-600 text-white rounded-md shadow focus:outline-none"
            >
              Modificar
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default SettingsForm;
