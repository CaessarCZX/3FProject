import { useCallback, useEffect, useState } from "react";
import { useDeployedContractInfo } from "../scaffold-eth/useDeployedContractInfo";
import { erc20Abi } from "viem";
import { useAccount } from "wagmi";
import { readContract } from "wagmi/actions";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

export const useGetAllowance = (tokenAddress: string) => {
  const currentMember = useAccount();
  const memberAddress = currentMember?.address ?? "0x0";
  const { data: contract } = useDeployedContractInfo("FFFBusiness");
  const currentContract = contract?.address ?? "0x";
  const [currentAllowance, setCurrentAllowance] = useState<bigint>(0n);

  const fetchAllowance = useCallback(async () => {
    try {
      const allowance = await readContract(wagmiConfig, {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "allowance",
        args: [memberAddress, currentContract],
      });
      setCurrentAllowance(allowance);
    } catch (e) {
      console.error("Error al obtener el allowance:");
    }
  }, [memberAddress, currentContract, tokenAddress]);

  useEffect(() => {
    if (memberAddress && currentContract) {
      fetchAllowance();
    }
  }, [fetchAllowance, memberAddress, currentContract]);

  return { currentAllowance };
};
