import React, { useEffect, useState } from "react";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { Abi } from "abitype";
import { jwtDecode } from "jwt-decode";
import { parseUnits } from "viem";
import { erc20Abi } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import { StageTransactionModal } from "~~/components/Actions/Transaction/StageTransactionModal";
// import { useInitializeMemberStatus } from "~~/hooks/3FProject/useInitializeMemberStatus";
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

interface DecodedToken {
  ReferersCommissions: string[];
  id: string;
  email: string;
}

interface UplineMembers {
  uplineAddress: string;
  secondLevelUpline: string;
  thirtLevelUpline: string;
}

const MemberFirstDepositButton: React.FC<{ depositAmount: string }> = ({ depositAmount }) => {
  const setIsActiveMemberStatus = useGlobalState(state => state.setIsActiveMemberStatus);
  const { fetchSavings } = useGetMemberSavings();
  const { writeContractAsync } = useWriteContract();
  const { data: contract } = useDeployedContractInfo("FFFBusiness");
  const allowanceAmount = depositAmount ? parseUnits(depositAmount, 6) : BigInt(0n); // Deposit for contract
  // const { getCurrentMemberStatus } = useInitializeMemberStatus();
  const contractAbi = contract?.abi;
  const currentContract = contract?.address ?? "0x";
  const member = useAccount();
  const memberAddress = member?.address ?? "0x0";
  const [id, setId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [uplineMembers, setUplineMembers] = useState<UplineMembers>({
    uplineAddress: "",
    secondLevelUpline: "",
    thirtLevelUpline: "",
  });

  // Get upline referrals for commission and user id
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        // Decodifica el JWT para obtener el contenido del payload
        const decoded: DecodedToken = jwtDecode(storedToken);
        const userId = decoded.id; // Extrae la propiedad id del usuario en el token
        const email = decoded.email; // Extraen el email del usuario en el token
        /**
         * IMPORTANTT!
         * @RefererCommissions brings the upline referer from top to bottom
         * with the direct upline in the last position
         */
        const uplines: string[] = decoded.ReferersCommissions.toReversed(); //Copy from ReferersCommmission

        if (uplines) {
          setUplineMembers({
            uplineAddress: uplines[0] || INVALID_ADDRESS, //For direct upline
            secondLevelUpline: uplines[1] || INVALID_ADDRESS, // For indirect upline in level 2
            thirtLevelUpline: uplines[2] || INVALID_ADDRESS, // For indirect upline in level 3
          });
        }

        setId(userId || null); // Ingresa propiedad Id
        setEmail(email || null);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, []);

  // Deposit Rules
  const minDeposit = parseUnits("2500", 6); // Solo para primer deposito
  const depositMultiple = parseUnits("500", 6);

  const [transaction, setTransaction] = useState<TransactionInfo>({
    allowanceHash: "",
    allowanceReceiptHash: "",
    depositContractHash: "",
    depositContractReceiptHash: "",
  });

  const [isStarted, setIsStarted] = useState(false);
  const [isHandleModalActivate, setIsHandleModalActivate] = useState(false);

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

  // const PathAmountToMail = {};

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

  const HandleDeposit = async () => {
    if (!depositAmount || depositAmount === "0") {
      ShowNotification(err.nonDeposit);
      resetFlags();
      return;
    }

    if (allowanceAmount < minDeposit || allowanceAmount % depositMultiple !== 0n) {
      ShowNotification(err.deposit);
      resetFlags();
      return;
    }

    try {
      setIsStarted(true);
      let allowanceReceiptHash = { status: "success", transactionHash: "previous approve" };

      if (isStarted === true || !tokenUsdt || !currentContract) {
        ShowNotification(err.general);
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
          console.log("Amount to server: ", amount);
          await performHealthCheck(amount, depositContractReceiptHash.transactionHash);

          setTimeout(() => {
            // getCurrentMemberStatus(); // Actualiza el status de activo del miembro en el contrato para dashboard comun
            // Force member status
            setIsActiveMemberStatus(true);
            fetchSavings();
          }, 3000);
        } else {
          ShowNotification(err.onTransaction);
        }
      } else {
        ShowNotification(err.allowance);
      }
    } catch (e: any) {
      ShowNotification(err.general);
      console.error(e.message);
    } finally {
      resetFlags();
    }
  };
  return (
    <>
      {/* Botón para Web (solo visible en pantallas grandes) */}
      <button
        className={`absolute right-2.5 top-1/2 -translate-y-1/2 py-2.5 px-8 text-white font-bold bg-brand-default hover:bg-brand-hover dark:bg-blue-600 dark:hover:bg-opacity-90 duration-300 z-50 rounded-full ${
          isStarted && "hidden"
        } hidden sm:block`} // Se oculta en móviles y se muestra en pantallas grandes
        onClick={() => HandleDeposit()}
      >
        {isStarted ? "Pendiente" : "Iniciar ahorro"}
      </button>

      {/* Botón para Móvil (solo visible en pantallas pequeñas) */}
      <button
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 py-2.5 px-8 text-white font-bold bg-brand-default hover:bg-brand-hover dark:bg-blue-600 dark:hover:bg-opacity-90 duration-300 z-50 rounded-full w-full ${
          isStarted && "hidden"
        } sm:hidden`} // Se oculta en pantallas grandes y se muestra en móviles
        onClick={() => HandleDeposit()}
      >
        {isStarted ? "Pendiente" : "Iniciar ahorro"}
      </button>

      {/* StageTransactionModal solo se activa cuando "isStarted" es true */}
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

export default MemberFirstDepositButton;
