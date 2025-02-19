import React, { useState } from "react";
import { FaRegEnvelope, FaRegUser } from "react-icons/fa6";
import BlockContainerWithTitle from "~~/components/UI/BlockContainerWithTitle";
import { Btn, BtnLoading, BtnStates } from "~~/components/UI/Button";
import InputField from "~~/components/UI/Input/InputField";
import { useShowUiNotifications } from "~~/hooks/3FProject/useShowUiNotifications";
import { useGetTokenData } from "~~/hooks/user/useGetTokenData";
import { updateUser } from "~~/services/CRUD/users";
import { validateEmailWithMessage, validateName } from "~~/utils/Form";

interface BeneficiaryProps {
  currentBeneficiaryName: string | undefined;
  currentBeneficiaryEmail: string | undefined;
  updateFunction: (userId: string) => void;
}

const BeneficiaryForm: React.FC<BeneficiaryProps> = ({
  currentBeneficiaryEmail,
  currentBeneficiaryName,
  updateFunction,
}) => {
  const iconStyles = "text-gray-400 dark:text-gray-100 w-4 h-4";
  const { tokenInfo } = useGetTokenData();
  const [isEditing, setIsEditing] = useState<boolean>();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [beneficiary, setBeneficiary] = useState({
    name: "",
    email: "",
  });

  // Message ui
  useShowUiNotifications({
    success,
    setSuccess,
    error,
    setError,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBeneficiary(prev => ({ ...prev, [name]: value }));
  };

  const changeEditState = () => {
    setIsEditing(!isEditing);
    setBeneficiary({ name: "", email: "" });
  };

  const handleSaveBeneficiary = async () => {
    if (!beneficiary.name || !beneficiary.email) {
      setError("Por favor complete todos los campos.");
      return;
    }

    // Validators
    const errorName = validateName(beneficiary.name);
    const errorEmail = validateEmailWithMessage(beneficiary.email);

    if (errorName) {
      setError(errorName);
      return;
    }
    if (errorEmail) {
      setError(errorEmail);
      return;
    }

    setIsSaving(true);

    const payload = {
      name_beneficiary: beneficiary.name,
      email_beneficiary: beneficiary.email,
    };

    try {
      const response = await updateUser(tokenInfo.id, payload);

      if (response?.status !== 200) throw new Error("Error al actualizar el beneficiario.");

      if (tokenInfo.id) updateFunction(tokenInfo.id);
      setSuccess("Beneficiario actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar el beneficiario:", error);
      setError("No se pudo actualizar el beneficiario.");
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  return (
    <BlockContainerWithTitle title="Beneficiario de cuenta">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InputField
          label="Nombre"
          type="text"
          name="name"
          value={beneficiary.name}
          onChange={handleInputChange}
          readOnly={!isEditing}
          placeholder={currentBeneficiaryName || "Nombre del beneficiario"}
          icon={<FaRegUser className={iconStyles} />}
        />
        <InputField
          label="Correo"
          type="email"
          name="email"
          value={beneficiary.email}
          onChange={handleInputChange}
          readOnly={!isEditing}
          placeholder={currentBeneficiaryEmail || "Correo del beneficiario"}
          icon={<FaRegEnvelope className={iconStyles} />}
        />
      </div>
      <div className="flex justify-end mt-6 transition-colors">
        {isEditing && (
          <Btn onClick={handleSaveBeneficiary} disabled={isSaving}>
            <BtnLoading text="Guardar Beneficiario" changeState={isSaving} />
          </Btn>
        )}
        <BtnStates onClick={() => changeEditState()} disabled={isSaving} changeState={isEditing} className="ml-4">
          {isEditing ? "Cancelar" : "Modificar"}
        </BtnStates>
      </div>
    </BlockContainerWithTitle>
  );
};

export default BeneficiaryForm;
