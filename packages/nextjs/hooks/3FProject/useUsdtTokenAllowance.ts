import { useCallback, useEffect, useState } from "react";
import { useDeployedContractInfo } from "../scaffold-eth/useDeployedContractInfo";
import { waitForTransactionReceipt } from "@wagmi/core";
import { erc20Abi } from "viem";
import { useWriteContract } from "wagmi";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

const tokenUsdt = process.env.NEXT_PUBLIC_TEST_TOKEN_ADDRESS_FUSDT ?? "0x";

const AllowanceErrors = Object.freeze({
  initialize: "Ha ocurrido un error inicializando el Allowance",
  general: "Ha ocurrido un error en el proceso de Allowance",
});

export const useUsdtTokenAllowance = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [inProcess, setInProcess] = useState(false);
  const [allowanceAmount, setAllowanceAmount] = useState<bigint>();
  const [error, setError] = useState("");
  const [activateModal, setActivateModal] = useState(false);
  const [allowanceHash, setAllowanceHash] = useState("");
  const [allowanceReceiptHash, setAllowanceReceiptHash] = useState("");
  const { data: contract } = useDeployedContractInfo("FFFBusiness");
  const currentContract = contract?.address ?? "0x";
  const { writeContractAsync } = useWriteContract();

  const resetFlags = () => {
    setInProcess(false);
  };

  const getAllowance = useCallback(async () => {
    try {
      setError("");
      setInProcess(true);
      if (!allowanceAmount || inProcess === true || !tokenUsdt || !currentContract) {
        setError(AllowanceErrors.initialize);
        resetFlags();
        return;
      }

      setActivateModal(true);

      const txHash = await writeContractAsync({
        abi: erc20Abi,
        address: tokenUsdt,
        functionName: "approve",
        args: [currentContract, allowanceAmount],
      });

      setAllowanceHash(txHash);

      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: txHash,
      });

      if (receipt.status === "success") {
        setAllowanceReceiptHash(receipt.transactionHash);
      } else {
        setError(`${AllowanceErrors.general} con estatus: ${receipt.status}`);
      }
    } catch (e) {
      if (error === "") setError(AllowanceErrors.general);
      console.error(error, e);
    } finally {
      resetFlags();
    }
  }, [allowanceAmount, currentContract, error, inProcess, writeContractAsync]);

  useEffect(() => {
    if (isStarted === true) {
      getAllowance();
      setIsStarted(false);
    }
  }, [isStarted, getAllowance]);

  return {
    activateModal,
    allowanceHash,
    allowanceReceiptHash,
    setIsStarted,
    setAllowanceAmount,
  };
};
