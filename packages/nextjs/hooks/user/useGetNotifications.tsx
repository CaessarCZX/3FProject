import { useEffect, useState } from "react";
import { useDeployedContractInfo } from "../scaffold-eth/useDeployedContractInfo";
import { jwtDecode } from "jwt-decode";
import { createPublicClient, formatUnits, http } from "viem";
import { sepolia } from "viem/chains";
import { useAccount } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";
import { getAlchemyHttpUrl, notification } from "~~/utils/scaffold-eth";

const client = createPublicClient({
  chain: sepolia,
  transport: http(getAlchemyHttpUrl(sepolia.id)),
  pollingInterval: scaffoldConfig.pollingInterval,
});

interface DecodedToken {
  isAdmin: boolean;
}

type BlockchainLogToken = {
  amount?: string | bigint;
  timestamp?: string | bigint;
};

type BlockchainLogReciever = {
  from?: string | "";
};

type BlockchainLogMember = {
  member?: string | "";
};

const ParseBlockchainRecieverEvent = (log: BlockchainLogReciever & BlockchainLogToken, isMembership?: boolean) => {
  const from = log.from;
  const amount = log.amount;
  const timestamp = new Date(Number(log.timestamp) * 1000).toLocaleString();

  return notification.none(
    <>
      <article className="flex">
        <div className="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
        <div className="flex flex-col ml-3">
          <div className="text-base font-normal">
            {isMembership ? "Nueva membresia entrante" : "Deposito a wallet concentradora"}
          </div>
          <div className="text-sm font-medium">
            De wallet: <span className="text-green-400 font-light text-[8px]">{from}</span>
          </div>
          <div className="text-sm font-medium">
            <span className="font-light">$</span> {formatUnits(BigInt(amount || 0), 6)}{" "}
            <span className="ml-1 font-bold">USDT</span>
          </div>
          <div className="text-sm font-light">{timestamp}</div>
        </div>
      </article>
    </>,
    { position: "bottom-right", duration: 7000 },
  );
};

const ParseBlockchainNewSavingEvent = (log: BlockchainLogMember & BlockchainLogToken) => {
  const from = log.member;
  const amount = log.amount;
  const timestamp = new Date(Number(log.timestamp) * 1000).toLocaleString();
  return notification.success(
    <div className="flex flex-col ml-3">
      <div className="text-base font-normal">Nuevo ahorro detectado</div>
      <div className="text-sm font-medium">
        De wallet: <span className="text-green-400 font-light text-[8px]">{from}</span>
      </div>
      <div className="text-sm font-medium">
        <span className="font-light">$</span> {formatUnits(BigInt(amount || 0), 6)}{" "}
        <span className="ml-1 font-bold">USDT</span>
      </div>
      <div className="text-sm font-light">{timestamp}</div>
    </div>,
    { position: "bottom-right", duration: 7000 },
  );
};

const ParseBlockchainCommissionEvent = (log: BlockchainLogToken) => {
  const amount = log.amount;
  const timestamp = new Date(Number(log.timestamp) * 1000).toLocaleString();
  return notification.success(
    <div className="flex flex-col ml-3">
      <div className="text-base font-normal">Comisión recibida</div>
      <div className="text-base font-medium">
        <span className="text-green-400">$</span> {formatUnits(BigInt(amount || 0), 6)}{" "}
        <span className="ml-1 font-bold">USDT</span>
      </div>
      <div className="text-sm font-light">{timestamp}</div>
    </div>,
    { position: "bottom-right", duration: 7000 },
  );
};

async function listenToCommissions(userAddress: string, contractAddress: string) {
  // console.log("Escuchando eventos...");

  client.watchEvent({
    address: contractAddress,
    event: {
      name: "CommissionPaid",
      type: "event",
      inputs: [
        { indexed: true, name: "to", type: "address" },
        { indexed: false, name: "amount", type: "uint256" },
        { indexed: false, name: "timestamp", type: "uint256" },
      ],
    },
    args: {
      to: userAddress, // Filtra por la dirección del usuario conectado
    },
    onLogs: logs => {
      logs.forEach(log => {
        ParseBlockchainCommissionEvent(log.args);
      });
    },
  });
}

async function listenToTransferBusiness(contractAddress: string) {
  // console.log("Escuchando eventos...");

  client.watchEvent({
    address: contractAddress,
    event: {
      name: "TransferBusiness",
      type: "event",
      inputs: [
        { indexed: true, name: "from", type: "address" },
        { indexed: false, name: "amount", type: "uint256" },
        { indexed: false, name: "timestamp", type: "uint256" },
      ],
    },
    onLogs: logs => {
      logs.forEach(log => {
        ParseBlockchainRecieverEvent(log.args);
      });
    },
  });
}

async function listenToMembershipPaid(contractAddress: string) {
  // console.log("Escuchando eventos...");

  client.watchEvent({
    address: contractAddress,
    event: {
      name: "MembershipPaid",
      type: "event",
      inputs: [
        { indexed: true, name: "from", type: "address" },
        { indexed: false, name: "amount", type: "uint256" },
        { indexed: false, name: "timestamp", type: "uint256" },
      ],
    },
    onLogs: logs => {
      logs.forEach(log => {
        ParseBlockchainRecieverEvent(log.args, true);
      });
    },
  });
}

async function listenToNewSavings(userAddress: string, contractAddress: string) {
  // console.log("Escuchando eventos...");

  client.watchEvent({
    address: contractAddress,
    event: {
      name: "NewSaving",
      type: "event",
      inputs: [
        { indexed: true, name: "member", type: "address" },
        { indexed: false, name: "amount", type: "uint256" },
        { indexed: false, name: "timestamp", type: "uint256" },
      ],
    },
    args: {
      member: userAddress,
    },
    onLogs: logs => {
      logs.forEach(log => {
        ParseBlockchainNewSavingEvent(log.args);
      });
    },
  });
}

export const useGetNotfications = () => {
  const { data: contract } = useDeployedContractInfo("FFFBusiness");
  const currentContract = contract?.address ?? "0x";
  const [isAdmin, setIsAdmin] = useState<boolean>(true);

  const { address, isConnected } = useAccount();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decodifica el JWT
        const decoded: DecodedToken = jwtDecode(token);

        // Verifica si el token es válido y si el usuario es administrador
        if (!decoded.isAdmin) {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      listenToCommissions(address, currentContract); // Pasa la dirección conectada al filtro
    }

    if (isConnected && address) {
      listenToNewSavings(address, currentContract);
    }

    if (isConnected && address && isAdmin) {
      listenToTransferBusiness(currentContract);
      listenToMembershipPaid(currentContract);
    }
  }, [isConnected, address, currentContract, isAdmin]);
};
