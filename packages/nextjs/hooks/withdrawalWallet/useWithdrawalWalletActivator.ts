import { useCallback } from "react";
import { ValidateInObject, findKeyWithType, useApiRequest } from "../api/useApiRequest";
import { updateWithdrawalWallet } from "~~/services/CRUD/withdrawalWallet";

interface Props {
  isActive: boolean;
  id: string;
}

const validator = (userId: string, payload: object) => {
  if (!userId) return "Faltan datos en la peticion.";
  const isActive = findKeyWithType(payload, "isActive", ValidateInObject.isBoolean);
  if (typeof isActive !== "boolean") return "Se ha ingresado un dato invalido";
  return null;
};

export const useWithdrawalWalletActivator = () => {
  const { isLoading, fetchData } = useApiRequest({
    apiFunction: updateWithdrawalWallet,
    validateParams: validator,
    successMsg: "Wallet secundaria actualizada",
  });

  const walletActivator = useCallback(
    async ({ isActive, id }: Props) => {
      const payload = { isActive };
      return fetchData(id, payload);
    },
    [fetchData],
  );

  return { isLoading, walletActivator };
};
