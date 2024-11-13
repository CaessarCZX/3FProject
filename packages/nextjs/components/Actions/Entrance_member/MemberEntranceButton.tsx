import { useState } from "react";
import { waitForTransactionReceipt } from "@wagmi/core";
import { Abi } from "abitype";
import { parseUnits } from "viem";
import { erc20Abi } from "viem";
import { useWriteContract } from "wagmi";
import { StageTransactionModal } from "~~/components/Actions/Transaction/StageTransactionModal";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { TransactionInfo } from "~~/utils/3FContract/deposit";
import { DepositErrors as err } from "~~/utils/errors/errors";

type DepositBtnProps = {
  uplineAddress: string;
  depositAmount: string | null;
  btnText: string;
};

const tokenUsdt = process.env.NEXT_PUBLIC_TEST_TOKEN_ADDRESS_FUSDT ?? "0x";

const MemberEntranceButton = ({ uplineAddress, depositAmount, btnText }: DepositBtnProps) => {
  const [isStarted, setIsStarted] = useState(false);
  const { data: contract } = useDeployedContractInfo("FFFBusiness");
  const currentContract = contract?.address ?? "0x";
  const contractAbi = contract?.abi;
  const { writeContractAsync } = useWriteContract();
  const [isHandleModalActivate, setIsHandleModalActivate] = useState(false);
  const allowanceAmount = depositAmount ? parseUnits(depositAmount, 6) : BigInt(0n);
  const [transaction, setTransaction] = useState<TransactionInfo>({
    allowanceHash: "",
    allowanceReceiptHash: "",
    depositContractHash: "",
    depositContractReceiptHash: "",
    error: "",
  });

  const resetFlags = () => {
    setIsStarted(false);
    setIsHandleModalActivate(false);
    setTransaction(prev => ({
      ...prev,
      allowanceHash: "",
      allowanceReceiptHash: "",
      depositContractHash: "",
      depositContractReceiptHash: "",
      error: "",
    }));
  };

  const HandleEntrance = async () => {
    try {
      setIsStarted(true);
      if (!depositAmount || isStarted === true || !tokenUsdt || !currentContract || !uplineAddress) {
        setTransaction(prev => ({
          ...prev,
          error: err.general,
        }));
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

      setTransaction(prev => ({
        ...prev,
        allowanceHash: txHash,
      }));

      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: txHash,
      });

      if (receipt.status === "success") {
        setTransaction(prev => ({
          ...prev,
          allowanceReceiptHash: receipt.transactionHash,
        }));

        const txHash = await writeContractAsync({
          abi: contractAbi as Abi,
          address: currentContract,
          functionName: "memberEntrance",
          args: [uplineAddress, allowanceAmount],
        });

        // This is provisional while MmembersEntrance Types doesn't exist
        setTransaction(prev => ({
          ...prev,
          depositContractHash: txHash,
        }));

        const receiptTx = await waitForTransactionReceipt(wagmiConfig, {
          hash: txHash,
        });

        if (receiptTx.status === "success") {
          // This is provisional while MmembersEntrance Types doesn't exist
          setTransaction(prev => ({
            ...prev,
            depositContractReceiptHash: receiptTx.transactionHash,
          }));
        }
      } else {
        // setError("La transacción de depósito falló");
      }
    } catch (e) {
      // setError("Se ha producido un error en el proceso de deposito");
      console.error(err.general, e);
    } finally {
      resetFlags();
    }
  };

  // const HandleTest = () => {
  //   setIsStarted(true);
  //   setIsHandleModalActivate(true);

  //   setTimeout(() => {
  //     setIsStarted(false);
  //   }, 5000);
  // };

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
          transaction={transaction}
          transactionDescription="Registro exitoso"
        />
      )}
    </>
  );
};

export default MemberEntranceButton;
