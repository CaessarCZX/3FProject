import React from "react";
import { FaRegEnvelope, FaRegUser } from "react-icons/fa6";
import BlockContainerWithTitle from "~~/components/UI/BlockContainerWithTitle";
import InputField from "~~/components/UI/Input/InputField";
import { useGetTokenData } from "~~/hooks/user/useGetTokenData";

const SettingsForm: React.FC = () => {
  const { tokenInfo } = useGetTokenData();
  const iconStyles = "text-gray-400 dark:text-gray-100 w-4 h-4";

  return (
    <BlockContainerWithTitle title="Información personal">
      {/* Información del Usuario */}
      {tokenInfo ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField
              label="Nombre"
              type="text"
              readOnly
              icon={<FaRegUser className={iconStyles} />}
              value={tokenInfo.name}
            />
            <InputField
              label="Correo electrónico"
              type="text"
              readOnly
              icon={<FaRegEnvelope className={iconStyles} />}
              value={tokenInfo.email}
            />
          </div>
        </>
      ) : (
        <p className="text-gray-500">Cargando información del usuario...</p>
      )}
    </BlockContainerWithTitle>
  );
};

export default SettingsForm;
