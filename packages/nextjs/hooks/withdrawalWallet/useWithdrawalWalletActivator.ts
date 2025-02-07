import { useCallback, useState } from "react";
import { useShowUiNotifications } from "../3FProject/useShowUiNotifications";
import { updateWithdrawalWallet } from "~~/services/CRUD/withdrawalWallet";

interface Props {
  isActive: boolean;
  id: string;
}

export const useWithdrawalWalletActivator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useShowUiNotifications({ success, setSuccess, error, setError });

  const walletActivator = useCallback(async ({ isActive, id }: Props) => {
    try {
      setIsLoading(true);

      if (!id) throw new Error("Faltan datos en la peticion.");

      if (typeof isActive !== "boolean") throw new Error("Se ha ingresado un dato invalido.");

      const payload = { isActive };

      const data = await updateWithdrawalWallet(id, payload);

      if (!data) throw new Error("Un error ha ocurrido al actualizar wallet secundaria.");

      setSuccess(`¡Wallet secundaria ${isActive ? "activada" : "desactivada"} para recibir pagos.`);
      return true;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, walletActivator };
};
