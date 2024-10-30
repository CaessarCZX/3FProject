import { useState } from "react";
import { StageTransactionModal } from "./StageTransactionModal";
import { waitForTransactionReceipt } from "@wagmi/core";
import { Abi } from "abitype";
import { parseUnits } from "viem";
import { erc20Abi } from "viem";
import { useWriteContract } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

type DepositBtnProps = {
  depositAmount: string | null;
};

// const DummieExample = {
//   transactionHash: "0x2188e59dd42eeb5f91f5b9d41c9c701e9d700137cddad049b5b6f95c83484b09",
//   transactionReceiptHash: "0xbe50e2b4e0e14ab9960b33e9d2880b6fbe673555710309941f9c84647c887ed0",
// };

const tokenUsdt = process.env.NEXT_PUBLIC_TEST_TOKEN_ADDRESS_FUSDT ?? "0x";

const DepositButton = ({ depositAmount }: DepositBtnProps) => {
  const [isStarted, setIsStarted] = useState(false);
  const [error, setError] = useState("");
  const { data: contract } = useDeployedContractInfo("FFFBusiness");
  const currentContract = contract?.address ?? "0x";
  const contractAbi = contract?.abi;
  const { writeContractAsync } = useWriteContract();
  const [isHandleModalActivate, setIsHandleModalActivate] = useState(false);
  const [transacciónHash, setTransactionHash] = useState("");
  const [transactionReceiptHash, setTransactionReceiptHash] = useState("");
  const [depositConfirmationHash, setDepositConfirmationHash] = useState("");
  const allowanceAmount = depositAmount ? parseUnits(depositAmount, 6) : BigInt(0n);

  const resetFlags = () => {
    setError("");
    setIsStarted(false);
    setIsHandleModalActivate(false);
    setTransactionHash("");
    setTransactionReceiptHash("");
    setDepositConfirmationHash("");
  };

  // const testMode = () => {
  //   setIsStarted(true);
  //   setIsHandleModalActivate(true);

  //   setTimeout(() => {
  //     setIsStarted(false);
  //     setIsHandleModalActivate(false);
  //   }, 5000);
  // };

  const HandleDeposit = async () => {
    try {
      setIsStarted(true);
      if (!depositAmount || isStarted === true || !tokenUsdt || !currentContract) {
        setError("Se ha producido un error en el proceso de deposito");
        resetFlags();
        return;
      }
      setIsHandleModalActivate(true);
      const txHash = await writeContractAsync({
        abi: erc20Abi,
        address: tokenUsdt,
        functionName: "approve",
        args: [currentContract, allowanceAmount],
      });

      setTransactionHash(txHash);
      console.log("Generated transaction" + txHash);

      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: txHash,
      });

      if (receipt.status === "success") {
        setTransactionReceiptHash(receipt.transactionHash);

        const txHash = await writeContractAsync({
          abi: contractAbi as Abi,
          address: currentContract,
          functionName: "depositMemberFunds",
          args: [allowanceAmount],
        });

        console.log("Transaccion realizada con exito: ", txHash);

        const receiptTx = await waitForTransactionReceipt(wagmiConfig, {
          hash: txHash,
        });

        console.log("Transaccion confirmada con: ", receiptTx.status);

        if (receiptTx.status === "success") setDepositConfirmationHash(receiptTx.transactionHash);
      } else {
        setError("La transacción de depósito falló");
      }
    } catch (e) {
      setError("Se ha producido un error en el proceso de deposito");
      console.error(error, e);
    } finally {
      resetFlags();
    }
  };

  return (
    <>
      {!isStarted && (
        <button
          type="button"
          className="text-white bg-blue-700 disabled:bg-slate-500 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700"
          onClick={() => HandleDeposit()}
        >
          {isStarted ? "Pendiente" : "Preparar deposito"}
        </button>
      )}
      {isStarted && (
        <StageTransactionModal
          activate={isHandleModalActivate}
          transactionHash={transacciónHash}
          transactionReceiptHash={transactionReceiptHash}
          finalTransactionReceiptHash={depositConfirmationHash}
          error={error}
        />
      )}
    </>
  );
};

export default DepositButton;
