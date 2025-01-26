import React from "react";
import { useGetTokenData } from "~~/hooks/user/useGetTokenData";

const SettingsForm: React.FC = () => {
  const { tokenInfo } = useGetTokenData();

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
      </div>
    </div>
  );
};

export default SettingsForm;
