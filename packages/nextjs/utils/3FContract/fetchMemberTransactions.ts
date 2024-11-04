import axios from "axios";
import { Hex, hexToBigInt } from "viem";
import { AlchemyTransaction, FetchTransactionsResult, MemberTransaction } from "~~/utils/3FContract/block";

export const fetchMemberTransactions = async (
  url: string,
  address: string | null,
  contractAddress: string | null,
): Promise<FetchTransactionsResult> => {
  console.log("Fetching");
  const data = {
    jsonrpc: "2.0",
    id: 1,
    method: "alchemy_getAssetTransfers",
    params: [
      {
        fromBlock: "0x0",
        toBlock: "latest",
        fromAddress: address,
        category: ["erc20"],
        withMetadata: true,
        excludeZeroValue: true,
        maxCount: "0x64",
      },
    ],
  };

  try {
    const response = await axios.post(url, data);
    const transfers = response.data?.result?.transfers;

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
    };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return {
      transactions: [],
    };
  }
};
