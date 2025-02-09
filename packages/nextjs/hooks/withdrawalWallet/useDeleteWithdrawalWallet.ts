import { useCallback } from "react";
import { useApiRequest } from "../api/useApiRequest";
import { deleteWithdrawalWallet } from "~~/services/CRUD/withdrawalWallet";

interface Props {
  id: string;
}

const validator = (userId: string) => {
  if (!userId) return "Faltan datos en la peticion.";
  return null;
};

export const useDeleteWithdrawalWallet = () => {
  const { isLoading, fetchData } = useApiRequest({
    apiFunction: deleteWithdrawalWallet,
    validateParams: validator,
    errorMsg: "Un error ha ocurrido al tratar de eliminar una wallet",
    successMsg: "¡Wallet secundaria eliminada exitosamente!",
  });

  const deleteWallet = useCallback(
    async ({ id }: Props) => {
      return fetchData(id);
    },
    [fetchData],
  );

  return { isLoading, deleteWallet };
};
