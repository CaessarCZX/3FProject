import { useEffect, useState } from "react";
import { useDeployedContractInfo } from "../scaffold-eth/useDeployedContractInfo";
import axios from "axios";
import { Hex, hexToBigInt } from "viem";
import { useChainId } from "wagmi";
import { AlchemyTransaction, MemberTransaction } from "~~/utils/3FContract/block";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

export const useFetchTransactions = (address: string | undefined) => {
  const [transactions, setTransactions] = useState<MemberTransaction[] | null>(null);
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
            category: ["erc20"],
            withMetadata: true,
            excludeZeroValue: true,
            maxCount: "0x64",
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
        const formattedTransactions: MemberTransaction[] = relevantTransfers.map((transfer: AlchemyTransaction) => ({
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
