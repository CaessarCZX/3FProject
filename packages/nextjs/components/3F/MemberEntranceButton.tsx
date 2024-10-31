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
  uplineAddress: string;
  depositAmount: string | null;
  btnText: string;
};

const tokenUsdt = process.env.NEXT_PUBLIC_TEST_TOKEN_ADDRESS_FUSDT ?? "0x";

const MemberEntranceButton = ({ uplineAddress, depositAmount, btnText }: DepositBtnProps) => {
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

  const HandleEntrance = async () => {
    try {
      setIsStarted(true);
      if (!depositAmount && isStarted === true && !tokenUsdt && !currentContract && !uplineAddress) {
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
          functionName: "memberEntrance",
          args: [uplineAddress, allowanceAmount],
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
          disabled={depositAmount ? Number(depositAmount) < 2000 : !depositAmount}
          className=" w-full text-white bg-blue-700 disabled:bg-slate-500 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-full text-sm px-5 py-2.5 inline-flex items-center justify-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700"
          onClick={() => HandleEntrance()}
        >
          {isStarted ? "Pendiente" : btnText}
        </button>
      )}
      {isStarted && (
        <StageTransactionModal
          activate={isHandleModalActivate}
          transactionHash={transacciónHash}
          transactionReceiptHash={transactionReceiptHash}
          finalTransactionReceiptHash={depositConfirmationHash}
          error={error}
          transactionDescription="Registro exitoso"
        />
      )}
    </>
  );
};

export default MemberEntranceButton;
