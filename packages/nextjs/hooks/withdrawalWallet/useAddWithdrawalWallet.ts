import useDisplayNotifications from "../3FProject/useDisplayNotifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getAddress, isAddress } from "viem";
import { addWithdrawalWallet } from "~~/services/CRUD/withdrawalWallet";

interface Props {
  wallet: string;
  id: string;
}

interface MutationProps {
  id: string;
  payload: object;
}

const validator = (id: string, wallet: string) => {
  if (!id || !wallet) return "Faltan datos en la petición.";
  if (!isAddress(wallet)) return "No es una dirección válida.";
  return null;
};

export const useAddWithdrawalWallet = () => {
  const queryClient = useQueryClient();
  const { setError, setSuccess } = useDisplayNotifications({});

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async ({ id, payload }: MutationProps) => addWithdrawalWallet(id, payload),
  });

  const addWallet = async ({ id, wallet }: Props) => {
    try {
      const isError = validator(id, wallet);
      if (isError) throw new Error(isError);

      const validWallet = getAddress(wallet);
      const payload = { wallet: validWallet };

      const res = await mutateAsync({ id, payload });

      setSuccess("¡Wallet secundaria agregada exitosamente!");

      queryClient.invalidateQueries({ queryKey: ["addWithdrawalWallet"] });
      return res;
    } catch (e: any) {
      setError(e.message || "Un error ha ocurrido al agregar una wallet");
      return null;
    }
  };

  return { isLoading: isPending, addWallet };
};
