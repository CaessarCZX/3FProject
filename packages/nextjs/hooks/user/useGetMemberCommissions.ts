import { useEffect } from "react";
import { useDeployedContractInfo } from "../scaffold-eth/useDeployedContractInfo";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { useAccount } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

const client = createPublicClient({
  chain: sepolia,
  transport: http(getAlchemyHttpUrl(sepolia.id)),
  pollingInterval: scaffoldConfig.pollingInterval,
});

async function listenToEvents(userAddress: string, contractAddress: string) {
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
        console.log("Evento recibido:", log);
      });
    },
  });
}

export const useGetMemberCommissions = () => {
  const { data: contract } = useDeployedContractInfo("FFFBusiness");
  const currentContract = contract?.address ?? "0x";

  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      listenToEvents(address, currentContract); // Pasa la dirección conectada al filtro
    }
  }, [isConnected, address, currentContract]);
};
