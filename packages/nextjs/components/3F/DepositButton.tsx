import { useCallback, useState } from "react";
import { StageTransactionModal } from "./StageTransactionModal";
import { DepositErrors as err } from "./errors";
import { waitForTransactionReceipt } from "@wagmi/core";
import { Abi } from "abitype";
import { parseUnits } from "viem";
import { erc20Abi } from "viem";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";
import { useGlobalState } from "~~/services/store/store";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { DepositBtnProps, TransactionInfo } from "~~/utils/3FContract/deposit";
import { fetchMemberTransactions } from "~~/utils/3FContract/fetchMemberTransactions";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

const tokenUsdt = process.env.NEXT_PUBLIC_TEST_TOKEN_ADDRESS_FUSDT ?? "0x";

const DepositButton = ({ depositAmount, btnText }: DepositBtnProps) => {
  const currentMember = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { data: contract } = useDeployedContractInfo("FFFBusiness");
  const setIsMemberTransactionsFetching = useGlobalState(state => state.setIsMemberTransactionsFetching);
  const setMemberTransactions = useGlobalState(state => state.setMemberTransactions);
  const [isStarted, setIsStarted] = useState(false);
  const [isHandleModalActivate, setIsHandleModalActivate] = useState(false);
  const allowanceAmount = depositAmount ? parseUnits(depositAmount, 6) : BigInt(0n);
  const chainId = useChainId();
  const contractAbi = contract?.abi;
  const url = getAlchemyHttpUrl(chainId) ?? "";
  const currentContract = contract?.address ?? "0x";
  const memberAddress = currentMember?.address ?? "0x0";
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

  const fetchTransactions = useCallback(async () => {
    setIsMemberTransactionsFetching(true);
    const { transactions } = await fetchMemberTransactions(url, memberAddress, currentContract);
    if (transactions) setMemberTransactions(transactions);
    setIsMemberTransactionsFetching(false);
  }, [setIsMemberTransactionsFetching, setMemberTransactions, url, memberAddress, currentContract]);

  const HandleDeposit = async () => {
    try {
      setIsStarted(true);
      if (!depositAmount || isStarted === true || !tokenUsdt || !currentContract) {
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
          functionName: "depositMemberFunds",
          args: [allowanceAmount],
        });

        setTransaction(prev => ({
          ...prev,
          depositContractHash: txHash,
        }));

        const receiptTx = await waitForTransactionReceipt(wagmiConfig, {
          hash: txHash,
        });

        if (receiptTx.status === "success") {
          setTransaction(prev => ({
            ...prev,
            depositContractReceiptHash: receiptTx.transactionHash,
          }));

          setTimeout(() => {
            fetchTransactions();
          }, 3000);
        }
      } else {
        setTransaction(prev => ({
          ...prev,
          error: err.onTransaction,
        }));
      }
    } catch (e) {
      setTransaction(prev => ({
        ...prev,
        error: err.general,
      }));
      console.error(e);
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
          {isStarted ? "Pendiente" : btnText}
        </button>
      )}
      {isStarted && (
        <StageTransactionModal
          activate={isHandleModalActivate}
          transaction={transaction}
          transactionDescription="Deposito Exitoso"
        />
      )}
    </>
  );
};

export default DepositButton;
