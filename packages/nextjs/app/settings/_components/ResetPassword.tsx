import React, { useEffect, useState } from "react";
import { LuKeyRound } from "react-icons/lu";
import BlockContainerWithTitle from "~~/components/UI/BlockContainerWithTitle";
import { Btn, BtnLoading } from "~~/components/UI/Button";
import InputPassword from "~~/components/UI/Input/InputPassword";
import { useShowUiNotifications } from "~~/hooks/3FProject/useShowUiNotifications";
import { useGetTokenData } from "~~/hooks/user/useGetTokenData";
import { validatePassword } from "~~/utils/Form";

const ResetPassword: React.FC = () => {
  const iconStyles = "text-gray-400 dark:text-gray-100 w-4 h-4";
  const [password, setPassword] = useState("");
  const { tokenInfo } = useGetTokenData();
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState<boolean | null>(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // Message ui
  useShowUiNotifications({
    success,
    setSuccess,
    error,
    setError,
  });

  useEffect(() => {
    if (password.length === 0) {
      setIsValidPassword(null);
      return;
    }

    if (password) {
      const validateResponse = validatePassword(password);
      setIsValidPassword(validateResponse.length === 0);
    }
  }, [password]);

  const handlePasswordChange = async () => {
    if (!password || !repeatPassword) {
      setError("Por favor, completa ambos campos.");
      return;
    }
    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsSaving(true);
    setIsValidPassword(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/users/resetPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: tokenInfo.email,
          wallet: tokenInfo.wallet,
          newPassword: password,
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error("Error al cambiar de contraseña");

      setSuccess(result.message || "¡Contraseña cambiada exitosamente!");
      setPassword("");
      setRepeatPassword("");
    } catch (error) {
      console.error("Error al llamar a la API:", error);
      setError("Hubo un error al cambiar la contraseña. Inténtalo de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BlockContainerWithTitle title="Cambiar contraseña">
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InputPassword
          label="Contraseña"
          showValidator
          validationState={isValidPassword === null ? "default" : isValidPassword === false ? "error" : "success"}
          enableHelper
          icon={<LuKeyRound className={iconStyles} />}
          password={password}
          setPassword={setPassword}
        />
        <InputPassword
          label="Repetir Contraseña"
          validationState={password.length === 0 ? "default" : password !== repeatPassword ? "error" : "success"}
          icon={<LuKeyRound className={iconStyles} />}
          password={repeatPassword}
          setPassword={setRepeatPassword}
        />
      </form>

      <div className="flex justify-end mt-6">
        <Btn onClick={handlePasswordChange} disabled={isSaving || !isValidPassword}>
          <BtnLoading text="Cambiar Contraseña" changeState={isSaving} />
        </Btn>
      </div>
    </BlockContainerWithTitle>
  );
};

export default ResetPassword;
