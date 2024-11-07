import { useCallback, useState } from "react";
import { StageTransactionModal } from "./StageTransactionModal";
import { waitForTransactionReceipt } from "@wagmi/core";
import { Abi } from "abitype";
import { parseUnits } from "viem";
import { erc20Abi } from "viem";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";
import { useGlobalState } from "~~/services/store/store";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { fetchMemberTransactions } from "~~/utils/3FContract/fetchMemberTransactions";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

type DepositBtnProps = {
  depositAmount: string | null;
  btnText: string;
};

// const TestData = {
//   transactionHash: "kdjf;ladfjlasfjklsfjslfjlsfjsklfjl",
//   transactionReceiptHash: "sdfklshdfjkhfkfhkfhalflfhsldkfhskdfh",
//   depositConfirmationHash: "kdsjfklasjflsjflihgfdqwuyiwehfdhfkjahf",
//   error: "",
// };

const tokenUsdt = process.env.NEXT_PUBLIC_TEST_TOKEN_ADDRESS_FUSDT ?? "0x";
// type DepositTransaction = {
//   allowanceHash: string | undefined;
//   allovanceReceiptHash: string | undefined;
//   depositContractHash: string | undefined;
//   depositContractReceiptHash: string | undefined;
//   error: string | undefined;
// };

const DepositButton = ({ depositAmount, btnText }: DepositBtnProps) => {
  const currentMember = useAccount();
  const setIsMemberTransactionsFetching = useGlobalState(state => state.setIsMemberTransactionsFetching);
  const setMemberTransactions = useGlobalState(state => state.setMemberTransactions);
  const [isStarted, setIsStarted] = useState(false);
  const [error, setError] = useState("");
  const { data: contract } = useDeployedContractInfo("FFFBusiness");
  const currentContract = contract?.address ?? "0x";
  const contractAbi = contract?.abi;
  const { writeContractAsync } = useWriteContract();
  const [isHandleModalActivate, setIsHandleModalActivate] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [transactionReceiptHash, setTransactionReceiptHash] = useState("");
  const [depositConfirmationHash, setDepositConfirmationHash] = useState("");
  const allowanceAmount = depositAmount ? parseUnits(depositAmount, 6) : BigInt(0n);
  const chainId = useChainId();
  const url = getAlchemyHttpUrl(chainId) ?? "";
  const memberAddress = currentMember?.address ?? "0x0";
  // const [transaction, setTransaction] = useState<DepositTransaction>({
  //   allowanceHash: "",
  //   allovanceReceiptHash: "",
  //   depositContractHash: "",
  //   depositContractReceiptHash: "",
  //   error: "",
  // });

  const resetFlags = () => {
    setError("");
    setIsStarted(false);
    setIsHandleModalActivate(false);
    setTransactionHash("");
    setTransactionReceiptHash("");
    setDepositConfirmationHash("");
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

        if (receiptTx.status === "success") {
          setDepositConfirmationHash(receiptTx.transactionHash);

          setTimeout(() => {
            fetchTransactions();
          }, 3000);
        }
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
          className="text-white bg-blue-700 disabled:bg-slate-500 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700"
          onClick={() => HandleDeposit()}
        >
          {isStarted ? "Pendiente" : btnText}
        </button>
      )}
      {isStarted && (
        <StageTransactionModal
          activate={isHandleModalActivate}
          transactionHash={transactionHash}
          transactionReceiptHash={transactionReceiptHash}
          finalTransactionReceiptHash={depositConfirmationHash}
          error={error}
          transactionDescription="Deposito Exitoso"
        />
      )}
    </>
  );
};

export default DepositButton;
