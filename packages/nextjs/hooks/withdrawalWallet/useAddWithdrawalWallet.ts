import { useCallback } from "react";
import { ValidateInObject, findKeyWithType, useApiRequest } from "../api/useApiRequest";
import { getAddress, isAddress } from "viem";
import { addWithdrawalWallet } from "~~/services/CRUD/withdrawalWallet";

interface Props {
  wallet: string;
  id: string;
}

const validator = (userId: string, payload: object) => {
  const wallet = findKeyWithType(payload, "wallet", ValidateInObject.isString);
  if (!userId || !wallet) return "Faltan datos en la peticion.";
  if (!isAddress(wallet)) return "No es una direccion valida.";
  (payload as any).wallet = getAddress(wallet); // Mutate the object
  return null;
};

export const useAddWithdrawalWallet = () => {
  const { isLoading, fetchData } = useApiRequest({
    apiFunction: addWithdrawalWallet,
    validateParams: validator,
    successMsg: "¡Wallet secundaria agregada exitosamente!",
    errorMsg: "Un error ha ocurrido al agregar una wallet",
  });

  const addWallet = useCallback(
    async ({ wallet, id }: Props) => {
      const payload = { wallet };
      return fetchData(id, payload);
    },
    [fetchData],
  );

  return { isLoading, addWallet };
};
