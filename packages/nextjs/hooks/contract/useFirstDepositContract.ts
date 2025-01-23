import { useEffect, useState } from "react";
import { useWatchBalance } from "../scaffold-eth/useWatchBalance";
import { useGetTokenData } from "../user/useGetTokenData";
import { useGetTransactionParams } from "./useGetTransactionParams";
import { readContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { erc20Abi, parseUnits } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import { useGetMemberSavings } from "~~/hooks/user/useGetMemberSavings";
import { useGlobalState } from "~~/services/store/store";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { TransactionInfo } from "~~/utils/3FContract/deposit";
import { USTD_APPROVE_ABI } from "~~/utils/Abi/usdt";
import { INVALID_ADDRESS } from "~~/utils/Transactions/constants";
import { GET_KEYS_IN } from "~~/utils/Transactions/constants";
import { DepositErrors as err } from "~~/utils/errors/errors";
import { notification } from "~~/utils/scaffold-eth";

const PATCH_MEMBERSHIP_TO_MAIL = 500;

interface UplineMembers {
  uplineAddress: string;
  secondLevelUpline: string;
  thirtLevelUpline: string;
}

const useFirstDepositContract = () => {
  // Get params for transaction according to the mode
  const { CONTRACT_ABI, CONTRACT_ADDRESS, MEMBERS_KEY, TOKEN_ADDRESS } = useGetTransactionParams(
    GET_KEYS_IN.PRODUCTION,
  );

  const currentUser = useAccount();
  const CURRENT_ADDRESS = currentUser.address ?? "0x0";
  const setIsActiveMemberStatus = useGlobalState(state => state.setIsActiveMemberStatus);
  const { tokenInfo, tokenError } = useGetTokenData();
  const { fetchSavings } = useGetMemberSavings();
  const { writeContractAsync } = useWriteContract();
  const { data: walletBalance } = useWatchBalance({ address: CURRENT_ADDRESS });
  const [id, setId] = useState<string | null>(null);
  const [uplineMembers, setUplineMembers] = useState<UplineMembers>({
    uplineAddress: "",
    secondLevelUpline: "",
    thirtLevelUpline: "",
  });
  const [transaction, setTransaction] = useState<TransactionInfo>({
    allowanceHash: "",
    allowanceReceiptHash: "",
    depositContractHash: "",
    depositContractReceiptHash: "",
  });

  const [isStarted, setIsStarted] = useState(false);
  const [isHandleModalActivate, setIsHandleModalActivate] = useState(false);
  const [error, setError] = useState<string | null>();
  // Deposit Rules
  const minDeposit = parseUnits("2500", 6); // Solo para primer deposito
  const depositMultiple = parseUnits("500", 6);

  // Get upline referrals for commission and user id
  useEffect(() => {
    if (!tokenError) {
      try {
        // Get data for sending transaction to DB
        setId(tokenInfo.id || null);
        // Get upline referrals for commission
        const uplines: string[] = tokenInfo.ReferersCommissions;

        if (uplines) {
          setUplineMembers({
            uplineAddress: uplines[0] || INVALID_ADDRESS, //For direct upline
            secondLevelUpline: uplines[1] || INVALID_ADDRESS, // For indirect upline in level 2
            thirtLevelUpline: uplines[2] || INVALID_ADDRESS, // For indirect upline in level 3
          });
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, [tokenError, tokenInfo.ReferersCommissions, tokenInfo.email, tokenInfo.id]);

  const resetFlags = () => {
    setIsStarted(false);
    setIsHandleModalActivate(false);
    setTransaction(prev => ({
      ...prev,
      allowanceHash: "",
      allowanceReceiptHash: "",
      depositContractHash: "",
      depositContractReceiptHash: "",
    }));
  };

  const ShowNotification = (message: string) => {
    notification.error(message, { position: "bottom-right", duration: 5000 });
  };

  const HandleTest = () => {
    console.log("Im activate");
    setIsStarted(true);
    setIsHandleModalActivate(true);
  };

  //Validar el servidor y bd funcionando
  const performHealthCheck = async (amount: number, hash: string) => {
    try {
      // Realizar el health check
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/health`);

      if (!response.ok) {
        throw new Error("El servidor no respondió correctamente.");
      }

      const data = await response.json();

      if (data.status === "ok") {
        console.log("Health check: Base de datos y servidor en línea");

        // **POST a /f3api/transaction si el health check es exitoso**
        const transactionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/transaction`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: id, // token id a userId
            amount,
            hash,
          }),
        });

        if (!transactionResponse.ok) {
          throw new Error("No se pudo crear la transacción.");
        }

        const transactionData = await transactionResponse.json();
        console.log("Transacción creada exitosamente:", transactionData);

        // Monto de resguardo en este ahorro
        const amountToFirstDeposit = amount - PATCH_MEMBERSHIP_TO_MAIL;

        //Envio de email y notificacion en el proceso
        await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/sendgrid/saving`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: id,
            amount: amountToFirstDeposit,
            hash,
            isFirstSaving: true,
          }),
        });
      } else {
        console.warn("Health check: Problema detectado con el servidor o la base de datos");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error en el proceso:", error.message);
      } else {
        console.error("Error desconocido en el proceso:", error);
      }
    }
  };

  async function approveUSDT(allowanceAmount: bigint, currentAllowance: bigint) {
    let allowanceToZero = { status: "success", transactionHash: "previous approve" };

    try {
      // Always set the allowance to 0 if currentAllowance is greater than 0
      if (currentAllowance > 0n) {
        const hash = await writeContract(wagmiConfig, {
          abi: USTD_APPROVE_ABI,
          address: TOKEN_ADDRESS,
          functionName: "approve",
          args: [CONTRACT_ADDRESS, BigInt(0n)],
        });

        allowanceToZero = await waitForTransactionReceipt(wagmiConfig, { hash });
        if (!allowanceToZero) throw new Error(err.allowance);
      }

      if (allowanceToZero.status !== "success") throw new Error(err.allowance);

      const hash = await writeContract(wagmiConfig, {
        abi: USTD_APPROVE_ABI,
        address: TOKEN_ADDRESS,
        functionName: "approve",
        args: [CONTRACT_ADDRESS, allowanceAmount],
      });

      setTransaction(prev => ({
        ...prev,
        allowanceHash: hash,
      }));

      const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });

      if (receipt.status === "success") {
        return receipt;
      } else {
        return null;
      }
    } catch (error: any) {
      console.error("Error en la aprobación:", error);

      if (error?.message?.includes("No matching key")) {
        console.error("🔍 Posible error en el ABI o en la red de la billetera.");
      }

      return null;
    }
  }

  const HandleDeposit = async ({ depositAmount }: { depositAmount: string | null }) => {
    const allowanceAmount = depositAmount ? parseUnits(depositAmount, 6) : BigInt(0n); // Deposit for contract
    const currentWalletBalance = walletBalance?.value || BigInt(0n);

    if (!depositAmount || depositAmount === "0") {
      ShowNotification(err.nonDeposit);
      setError(err.nonDeposit);
      resetFlags();
      return;
    }

    if (allowanceAmount < minDeposit || allowanceAmount % depositMultiple !== 0n) {
      ShowNotification(err.deposit);
      setError(err.deposit);
      resetFlags();
      return;
    }

    if (allowanceAmount > currentWalletBalance) {
      ShowNotification(err.balance);
      setError(err.balance);
      return;
    }

    try {
      setIsStarted(true);

      if (isStarted === true || !TOKEN_ADDRESS || !CONTRACT_ADDRESS) {
        ShowNotification(err.general);
        setError(err.general);
        resetFlags();
        return;
      }
      // Activate modal
      setIsHandleModalActivate(true);

      /**
       * IMPORTANT!: This verification is not valid for USDT TETHER cause the allowance always it's set to 0
       * Feature to be removed soon @Allowance query
       */
      // Allowance query
      const currentAllowance = await readContract(wagmiConfig, {
        address: TOKEN_ADDRESS,
        abi: erc20Abi,
        functionName: "allowance",
        args: [CURRENT_ADDRESS, CONTRACT_ADDRESS],
      });

      const allowanceReceiptHash = await approveUSDT(allowanceAmount, BigInt(currentAllowance) || 0n);

      if (allowanceReceiptHash?.status === "success") {
        setTransaction(prev => ({
          ...prev,
          allowanceReceiptHash: allowanceReceiptHash?.transactionHash,
        }));

        /**
         * "memberEntrance" function ere sort params for right execution according to ABI encoder
         */
        console.log(
          //For debug only
          `you are deposit: ${allowanceAmount}
          your direct upline: ${uplineMembers.uplineAddress}
          your second level upline: ${uplineMembers.secondLevelUpline}
          your thirt level upline: ${uplineMembers.thirtLevelUpline}`,
        );

        const depositContractHash = await writeContractAsync({
          abi: CONTRACT_ABI,
          address: CONTRACT_ADDRESS,
          functionName: "memberEntrance",
          args: [
            uplineMembers.uplineAddress,
            uplineMembers.secondLevelUpline,
            uplineMembers.thirtLevelUpline,
            allowanceAmount,
            MEMBERS_KEY,
          ],
        });

        setTransaction(prev => ({
          ...prev,
          depositContractHash: depositContractHash,
        }));

        const depositContractReceiptHash = await waitForTransactionReceipt(wagmiConfig, {
          hash: depositContractHash,
        });

        if (depositContractReceiptHash.status === "success") {
          setTransaction(prev => ({
            ...prev,
            depositContractReceiptHash: depositContractReceiptHash.transactionHash,
          }));

          const amount = parseFloat(depositAmount); // Monto a enviar al servidor convertido a number
          await performHealthCheck(amount, depositContractReceiptHash.transactionHash);

          setTimeout(() => {
            // Actualiza el status de activo del miembro en el contrato
            // Force member status
            setIsActiveMemberStatus(true);
            fetchSavings(1);
          }, 3000);
        } else {
          ShowNotification(err.onTransaction);
          setError(err.onTransaction);
          throw new Error("Something is wrong");
        }
      } else {
        ShowNotification(err.allowance);
        setError(err.allowance);
        throw new Error("Something is wrong");
      }
    } catch (e: any) {
      ShowNotification(err.general);
      setError(err.general);
      console.error(e.message);

      if (e?.message?.includes("No matching key")) {
        console.error("🔍 Posible error en el ABI o en la red de la billetera.");
      }
    } finally {
      resetFlags();
    }
  };
  return {
    isHandleModalActivate,
    isStarted,
    error,
    transaction,
    HandleDeposit,
    HandleTest,
  };
};

export default useFirstDepositContract;
