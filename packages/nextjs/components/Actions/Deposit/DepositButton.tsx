import { useEffect, useState } from "react";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { Abi } from "abitype";
import { jwtDecode } from "jwt-decode";
import { parseUnits } from "viem";
import { erc20Abi } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import { StageTransactionModal } from "~~/components/Actions/Transaction/StageTransactionModal";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";
import { useGetMemberSavings } from "~~/hooks/user/useGetMemberSavings";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { DepositBtnProps, TransactionInfo } from "~~/utils/3FContract/deposit";
import { DepositErrors as err } from "~~/utils/errors/errors";
import { notification } from "~~/utils/scaffold-eth";

interface DecodedToken {
  id: string;
  email: string;
}

const tokenUsdt = process.env.NEXT_PUBLIC_TEST_TOKEN_ADDRESS_FUSDT ?? "0x";
const MEMBERS_KEY = process.env.NEXT_PUBLIC_INVITATION_MEMBERS_KEY;
const INVALID_ADDRESS = "0x0000000000000000000000000000000000000000";

interface DecodedToken {
  ReferersCommissions: string[];
}

interface UplineMembers {
  uplineAddress: string;
  secondLevelUpline: string;
  thirtLevelUpline: string;
}

const DepositButton = ({ depositAmount, btnText }: DepositBtnProps) => {
  const { fetchSavings } = useGetMemberSavings();
  const { writeContractAsync } = useWriteContract();
  const { data: contract } = useDeployedContractInfo("FFFBusiness");
  const allowanceAmount = depositAmount ? parseUnits(depositAmount, 6) : BigInt(0n); // Deposit for contract
  const contractAbi = contract?.abi;
  const currentContract = contract?.address ?? "0x";
  const member = useAccount();
  const memberAddress = member?.address ?? "0x0";
  const [uplineMembers, setUplineMembers] = useState<UplineMembers>({
    uplineAddress: "",
    secondLevelUpline: "",
    thirtLevelUpline: "",
  });

  // Get upline referrals for commission
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        // Decodifica el JWT para obtener el contenido del payload
        const decoded: DecodedToken = jwtDecode(storedToken);
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
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, []);
  const [id, setId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  // Deposit Rules
  const minDeposit = parseUnits("2000", 6);
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

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        // Decodifica el JWT para obtener el contenido del payload
        const decoded: DecodedToken = jwtDecode(storedToken);
        setId(decoded.id || null); // Extrae la propiedad id del usuario en el token
        setEmail(decoded.email || null); // Extrae el email del usuario
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, []);

  const ShowNotification = (message: string) => {
    notification.error(message, { position: "bottom-right", duration: 5000 });
  };

  // const HandleTest = () => {
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

        await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/sendgrid/saving`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            toEmail: email,
            amount: amount,
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

      console.log("currentAllowance: ", currentAllowance); //For debug

      // To patch previous allowance
      if (currentAllowance === allowanceAmount) {
        setTransaction(prev => ({
          ...prev,
          allowanceHash: allowanceReceiptHash.transactionHash,
        }));
      }

      if (currentAllowance < allowanceAmount) {
        const allowanceRequest = allowanceAmount - currentAllowance;
        console.log("currentAllowance: ", allowanceRequest); //For debug

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
         * "depositMemberFunds" function ere sort params for right execution according to ABI encoder
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
          functionName: "depositMemberFunds",
          args: [
            allowanceAmount,
            uplineMembers.uplineAddress,
            uplineMembers.secondLevelUpline,
            uplineMembers.thirtLevelUpline,
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
            fetchSavings(1);
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
      {!isStarted && (
        <button
          type="button"
          className="text-white bg-brand-default disabled:bg-slate-500 hover:bg-brand-hover focus:ring-4 focus:outline-none font-medium rounded-md text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700"
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
