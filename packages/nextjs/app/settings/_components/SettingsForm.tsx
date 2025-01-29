import React from "react";
import BlockContainerWithTitle from "~~/components/UI/BlockContainerWithTitle";
import { useGetTokenData } from "~~/hooks/user/useGetTokenData";

const SettingsForm: React.FC = () => {
  const { tokenInfo } = useGetTokenData();

  return (
    <BlockContainerWithTitle title="Información personal">
      {/* Información del Usuario */}
      {tokenInfo ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
        </>
      ) : (
        <p className="text-gray-500">Cargando información del usuario...</p>
      )}
    </BlockContainerWithTitle>
  );
};

export default SettingsForm;
