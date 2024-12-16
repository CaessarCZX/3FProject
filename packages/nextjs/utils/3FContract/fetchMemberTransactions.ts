import axios from "axios";
import { Hex, hexToBigInt } from "viem";
import { AlchemyTransaction, FetchTransactionsResult, MemberTransaction } from "~~/utils/3FContract/block";

export const fetchMemberTransactions = async (
  url: string,
  address: string | null,
  contractAddress: string | null,
): Promise<FetchTransactionsResult> => {
  if (!address) {
    console.error("Wallet de cliente no se ha encontrado.");
    return { transactions: [], error: "Wallet de cliente no se ha encontrado." };
  }

  if (!contractAddress) {
    console.error("Direccion del contrato es nulo o no se ha proporcionado.");
    return { transactions: [], error: "Direccion del contrato es nulo o no se ha proporcionado" };
  }

  const data = {
    id: 1,
    jsonrpc: "2.0",
    method: "alchemy_getAssetTransfers",
    params: [
      {
        fromBlock: "0x0",
        toBlock: "latest",
        fromAddress: address,
        category: ["erc20", "external"],
        withMetadata: true,
        excludeZeroValue: true,
        maxCount: "0x3e8",
      },
    ],
  };

  try {
    const response = await axios.post(url, data);
    const transfers = await response.data?.result?.transfers;

    const relevantTransfers = transfers.filter((tx: AlchemyTransaction) => tx.to === contractAddress?.toLowerCase());

    // Extraer la información relevante de cada transferencia
    const formattedTransactions: MemberTransaction[] = relevantTransfers.map((transfer: AlchemyTransaction) => ({
      hash: transfer.hash,
      value: hexToBigInt(transfer.rawContract.value as Hex),
      timestamp: transfer.metadata.blockTimestamp,
      status: transfer.category,
    }));

    return {
      transactions: formattedTransactions,
      error: "",
    };
  } catch (error) {
    // console.warn("Error fetching transactions:");
    if (axios.isAxiosError(error)) {
      console.warn("Alchemy API call failed:", error.response?.data || error.message);
    } else {
      console.warn("Unexpected error:", error);
    }

    return {
      transactions: [],
      error: "ha ocurrido un error en la peticion de transacciones",
    };
  }
};
