import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import {
  ParseBlockchainCommissionEvent,
  ParseBlockchainNewSavingEvent,
  ParseBlockchainRecieverEvent,
} from "~~/components/UI/BlockchainNotifications";
import scaffoldConfig from "~~/scaffold.config";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth/networks";

const client = createPublicClient({
  chain: sepolia,
  transport: http(getAlchemyHttpUrl(sepolia.id)),
  pollingInterval: scaffoldConfig.pollingInterval,
});

export const listenToMembershipPaid = async (contractAddress: string) => {
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
      if (logs.length > 0) {
        const lastLog = logs[logs.length - 1];
        ParseBlockchainRecieverEvent(lastLog.args, true);
      }
    },
  });
};

export const listenToTransferBusiness = async (contractAddress: string) => {
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
      if (logs.length > 0) {
        const lastLog = logs[logs.length - 1];
        ParseBlockchainRecieverEvent(lastLog.args);
      }
    },
  });
};

export const listenToNewSavings = async (contractAddress: string, clientAddress: string) => {
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
      member: clientAddress,
    },
    onLogs: logs => {
      console.log(logs);
      if (logs.length > 0) {
        const lastLog = logs[logs.length - 1];
        ParseBlockchainNewSavingEvent(lastLog.args);
      }
    },
  });
};

export const listenToCommissions = async (contractAddress: string, clientAddress: string) => {
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
      to: clientAddress, // Filtra por la dirección del usuario conectado
    },
    onLogs: logs => {
      if (logs.length > 0) {
        const lastLog = logs[logs.length - 1];
        ParseBlockchainCommissionEvent(lastLog.args);
      }
    },
  });
};
