import { useEffect, useState } from "react";
import { useDeployedContractInfo } from "../scaffold-eth/useDeployedContractInfo";
import { Abi } from "abitype";
import {
  MEMBERS_INVITATION_KEY,
  TESTNET_CONTRACT_ADDRESS,
  TESTNET_USDT_TOKEN_ADDRESS,
  USDT_TOKEN_ADDRESS,
} from "~~/utils/Transactions/constants";

interface TransactionAddresses {
  CONTRACT_ADDRESS: string;
  TOKEN_ADDRESS: string;
  MEMBERS_KEY: string;
  CONTRACT_ABI: Abi;
}

/**
 * ONLY_USABLE: FOR DEVELOPMENT
 * @param isProducction is only usable with @GET_KEYS_IN var
 * @returns the production or development addresses as appropriate.
 */

export const useGetTransactionParams = (isProduction: boolean) => {
  const [addresses, setAddresses] = useState<TransactionAddresses>({
    CONTRACT_ADDRESS: "0x0",
    TOKEN_ADDRESS: "0x0",
    MEMBERS_KEY: "0x0",
    CONTRACT_ABI: [],
  });

  const { data: contract } = useDeployedContractInfo("FFFBusiness");
  const PRODUCTION_CONTRACT_ADDRESS = contract?.address ?? "0x";
  const BUSINESS_ABI = contract?.abi;

  useEffect(() => {
    setAddresses({
      CONTRACT_ADDRESS: isProduction ? PRODUCTION_CONTRACT_ADDRESS : TESTNET_CONTRACT_ADDRESS,
      TOKEN_ADDRESS: isProduction ? USDT_TOKEN_ADDRESS : TESTNET_USDT_TOKEN_ADDRESS,
      MEMBERS_KEY: MEMBERS_INVITATION_KEY, // Currently is a constant
      CONTRACT_ABI: BUSINESS_ABI as Abi, // Currently is a constant
    });
  }, [BUSINESS_ABI, PRODUCTION_CONTRACT_ADDRESS, isProduction]);

  return addresses;
};
