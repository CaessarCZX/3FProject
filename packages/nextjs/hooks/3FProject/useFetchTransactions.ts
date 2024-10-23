import { useEffect, useState } from "react";
import { useDeployedContractInfo } from "../scaffold-eth/useDeployedContractInfo";
import axios from "axios";
import { Hex, hexToBigInt } from "viem";
import { useChainId } from "wagmi";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

interface Transaction {
  hash: string;
  value: string;
  timestamp: string;
  status: string;
}

interface UseFetchTransactionsResult {
  transactions: Transaction[] | null;
  isLoading: boolean;
  error: boolean;
}

interface AlchemyTransaction {
  asset: string | null;
  blockNum: string;
  category: string;
  erc721TokenId: string | null;
  erc1155Metadata: any | null;
  from: string;
  hash: string;
  metadata: {
    blockTimestamp: string;
  };
  rawContract: {
    value: string;
    address: string;
    decimal: number | null;
  };
  to: string;
  tokenId: string | null;
  uniqueId: string;
  value: string | null;
}

export const useFetchTransactions = (address: string | undefined): UseFetchTransactionsResult => {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const { data: contract } = useDeployedContractInfo("FFFBusiness");
  const contractAddress = contract?.address ?? "0x";
  const chainId = useChainId();
  const url = getAlchemyHttpUrl(chainId) ?? "0x";

  useEffect(() => {
    if (!address && !url && !contractAddress) return;

    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(false);

      const data = {
        jsonrpc: "2.0",
        id: 1,
        method: "alchemy_getAssetTransfers",
        params: [
          {
            fromBlock: "0x0",
            toBlock: "latest",
            fromAddress: address,
            // toAddress: contractAddress,
            category: ["erc20"],
            withMetadata: true,
            excludeZeroValue: true,
            maxCount: "0x64", // Ajusta el número máximo de transacciones a recuperar
          },
        ],
      };

      try {
        const response = await axios.post(url, data);
        const transfers = response.data.result.transfers;

        const relevantTransfers = transfers.filter(
          (tx: AlchemyTransaction) => tx.to === contractAddress?.toLowerCase(),
        );

        // Extraer la información relevante de cada transferencia
        const formattedTransactions: Transaction[] = relevantTransfers.map((transfer: AlchemyTransaction) => ({
          hash: transfer.hash,
          value: hexToBigInt(transfer.rawContract.value as Hex),
          timestamp: transfer.metadata.blockTimestamp,
          status: transfer.category,
        }));

        setTransactions(formattedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [address, url, contractAddress]);

  return { transactions, isLoading, error };
};
