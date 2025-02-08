import { useCallback, useState } from "react";
import { useShowUiNotifications } from "../3FProject/useShowUiNotifications";
import { deleteWithdrawalWallet } from "~~/services/CRUD/withdrawalWallet";

interface Props {
  id: string;
}

export const useDeleteWithdrawalWallet = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useShowUiNotifications({ success, setSuccess, error, setError });

  const deleteWallet = useCallback(async ({ id }: Props) => {
    try {
      setIsLoading(true);

      if (!id) throw new Error("Faltan datos en la peticion");

      const data = await deleteWithdrawalWallet(id);

      if (!data) throw new Error("Un error ha ocurrido al tratar de eliminar una wallet");

      setSuccess("¡Wallet secundaria eliminada exitosamente!");
      return true;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, deleteWallet };
};
