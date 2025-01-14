import { useEffect, useState } from "react";
import { useWatchBalance } from "../scaffold-eth/useWatchBalance";
import { useGetTokenData } from "../user/useGetTokenData";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { Abi } from "abitype";
import { parseUnits } from "viem";
import { erc20Abi } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";
import { useGetMemberSavings } from "~~/hooks/user/useGetMemberSavings";
import { useGlobalState } from "~~/services/store/store";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { TransactionInfo } from "~~/utils/3FContract/deposit";
import { DepositErrors as err } from "~~/utils/errors/errors";
import { notification } from "~~/utils/scaffold-eth";

const tokenUsdt = process.env.NEXT_PUBLIC_TEST_TOKEN_ADDRESS_FUSDT ?? "0x";
const MEMBERS_KEY = process.env.NEXT_PUBLIC_INVITATION_MEMBERS_KEY;
const INVALID_ADDRESS = "0x0000000000000000000000000000000000000000";
const PATCH_MEMBERSHIP_TO_MAIL = 500;

interface UplineMembers {
  uplineAddress: string;
  secondLevelUpline: string;
  thirtLevelUpline: string;
}

const useFirstDepositContract = () => {
  const setIsActiveMemberStatus = useGlobalState(state => state.setIsActiveMemberStatus);
  const { tokenInfo, tokenError } = useGetTokenData();
  const { fetchSavings } = useGetMemberSavings();
  const { writeContractAsync } = useWriteContract();
  const { data: contract } = useDeployedContractInfo("FFFBusiness");
  const contractAbi = contract?.abi;
  const currentContract = contract?.address ?? "0x";
  const member = useAccount();
  const memberAddress = member?.address ?? "0x0";
  const { data: walletBalance } = useWatchBalance({ address: memberAddress });
  const [id, setId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
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
        setEmail(tokenInfo.email || null);
        // Get upline referrals for commission
        /**
         * IMPORTANTT!
         * @RefererCommissions brings the upline referer from top to bottom
         * with the direct upline in the last position
         */
        const uplines: string[] = tokenInfo.ReferersCommissions.toReversed(); //Copy from ReferersCommmission
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

  // const HandleTest = () => {
  //   console.log("Im activate");
  //   setIsStarted(true);
  //   setIsHandleModalActivate(true);
  // };

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
            toEmail: email,
            amount: amountToFirstDeposit,
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
      let allowanceReceiptHash = { status: "success", transactionHash: "previous approve" };

      if (isStarted === true || !tokenUsdt || !currentContract) {
        ShowNotification(err.general);
        setError(err.general);
        resetFlags();
        return;
      }
      // Activate modal
      setIsHandleModalActivate(true);

      // Allowance query
      const currentAllowance = await readContract(wagmiConfig, {
        address: tokenUsdt,
        abi: erc20Abi,
        functionName: "allowance",
        args: [memberAddress, currentContract],
      });

      console.log("currentAllowance: ", currentAllowance);
      console.log(typeof currentAllowance); //For debug

      // To patch previous allowance
      if (currentAllowance === allowanceAmount) {
        setTransaction(prev => ({
          ...prev,
          allowanceHash: allowanceReceiptHash.transactionHash,
        }));
      }

      if (currentAllowance < allowanceAmount) {
        const allowanceRequest = allowanceAmount - currentAllowance;
        console.log(allowanceRequest);

        const allowanceHash = await writeContractAsync({
          abi: erc20Abi,
          address: tokenUsdt,
          functionName: "approve",
          args: [currentContract, allowanceAmount],
        });

        setTransaction(prev => ({
          ...prev,
          allowanceHash: allowanceHash,
        }));

        allowanceReceiptHash = await waitForTransactionReceipt(wagmiConfig, {
          hash: allowanceHash,
        });
      }

      if (allowanceReceiptHash.status === "success") {
        setTransaction(prev => ({
          ...prev,
          allowanceReceiptHash: allowanceReceiptHash.transactionHash,
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
          abi: contractAbi as Abi,
          address: currentContract,
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
            fetchSavings();
          }, 3000);
        } else {
          ShowNotification(err.onTransaction);
          setError(err.onTransaction);
        }
      } else {
        ShowNotification(err.allowance);
        setError(err.allowance);
      }
    } catch (e: any) {
      ShowNotification(err.general);
      setError(err.general);
      console.error(e.message);
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
  };
};

export default useFirstDepositContract;
