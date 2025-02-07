import { useCallback, useState } from "react";
import { useShowUiNotifications } from "../3FProject/useShowUiNotifications";
import { getAddress, isAddress } from "viem";
import { addWithdrawalWallet } from "~~/services/CRUD/withdrawalWallet";

interface Props {
  wallet: string;
  id: string;
}

export const useAddWithdrawalWallet = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useShowUiNotifications({ success, setSuccess, error, setError });

  const addWallet = useCallback(async ({ wallet, id }: Props) => {
    try {
      setIsLoading(true);

      if (!wallet || !id) throw new Error("Faltan datos en la peticion");

      if (!isAddress(wallet)) throw new Error("No es una direccion valida");

      const validAddress = getAddress(wallet);

      const payload = { wallet: validAddress };

      const data = await addWithdrawalWallet(id, payload);

      if (!data) throw new Error("Un error ha ocurrido al agregar una wallet");

      setSuccess("¡Wallet secundaria agregada exitosamente!");
      return true;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, addWallet };
};
