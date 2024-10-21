import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useChainId } from "wagmi";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

function useFetchUserTransactions(chosenAddress: string | undefined) {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(false);
  const chainId = useChainId();
  const url = getAlchemyHttpUrl(chainId) ?? "0x";

  const getTransactions = useCallback(async () => {
    const data = {
      jsonrpc: "2.0",
      id: 1,
      method: "alchemy_getAssetTransfers",
      params: [
        {
          fromBlock: "0x0",
          toBlock: "latest",
          fromAddress: chosenAddress,
          // category: ["external", "erc20", "erc721"],
          category: ["erc20"],
          withMetadata: true,
          excludeZeroValue: true,
          maxCount: "0x64", // Número máximo de transacciones a recuperar (ajustable)
        },
      ],
    };
    try {
      if (!url && !chosenAddress) return;
      const response = await axios.post(url, data);
      const transfers = response.data.result.transfers;
      setTransactions(transfers);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(true);
    }
  }, [chosenAddress, url]);

  useEffect(() => {
    getTransactions();
  }, [getTransactions]);

  return {
    transactions,
    error,
  };
}

export default useFetchUserTransactions;
