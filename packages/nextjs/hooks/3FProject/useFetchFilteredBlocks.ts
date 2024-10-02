import { useCallback, useEffect, useState } from "react";
import { Hash, Transaction, TransactionReceipt, createTestClient, publicActions, walletActions, webSocket } from "viem";
import { hardhat } from "viem/chains";
import { decodeTransactionData } from "~~/utils/scaffold-eth";

const BLOCKS_PER_PAGE = 20;

export const testClient = createTestClient({
  chain: hardhat,
  mode: "hardhat",
  transport: webSocket("ws://127.0.0.1:8545"),
})
  .extend(publicActions)
  .extend(walletActions);

export const useFetchFilteredBlocks = (address?: string) => {
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [transactionReceipts, setTransactionReceipts] = useState<{ [key: string]: TransactionReceipt }>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [totalBlocks, setTotalBlocks] = useState(0n);
  const [error, setError] = useState<Error | null>(null);

  // Fetch blocks and filter transactions for the given address
  const fetchBlocks = useCallback(async () => {
    setError(null);
    const normalizeAddress = address?.toLowerCase();
    try {
      const blockNumber = await testClient.getBlockNumber();
      setTotalBlocks(blockNumber);

      const startingBlock = blockNumber - BigInt(currentPage * BLOCKS_PER_PAGE);
      const blockNumbersToFetch = Array.from(
        { length: Number(BLOCKS_PER_PAGE < startingBlock + 1n ? BLOCKS_PER_PAGE : startingBlock + 1n) },
        (_, i) => startingBlock - BigInt(i),
      );

      const blocksWithTransactions = blockNumbersToFetch.map(async blockNumber =>
        testClient.getBlock({ blockNumber, includeTransactions: true }),
      );
      const fetchedBlocks = await Promise.all(blocksWithTransactions);

      const relevantTransactions = fetchedBlocks.flatMap(block =>
        block.transactions.filter(
          tx => (tx as Transaction).from === normalizeAddress || (tx as Transaction).to === normalizeAddress,
        ),
      );

      // Decode and set the relevant transactions
      relevantTransactions.forEach(tx => decodeTransactionData(tx));

      // Get transaction receipts for the relevant transactions
      const receipts = await Promise.all(
        relevantTransactions.map(async tx => {
          const receipt = await testClient.getTransactionReceipt({ hash: (tx as Transaction).hash });
          return { [(tx as Transaction).hash]: receipt };
        }),
      );

      setFilteredTransactions(relevantTransactions);
      setTransactionReceipts(prevReceipts => ({ ...prevReceipts, ...Object.assign({}, ...receipts) }));
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred."));
    }
  }, [currentPage, address]);

  // Update transactions and receipts when new blocks are created
  useEffect(() => {
    if (!address) {
      setError(new Error("Non valid address."));
      return;
    }

    const handleNewBlock = async (newBlock: any) => {
      try {
        // Fetch only if it's the first page (latest transactions)
        if (currentPage === 0) {
          if (newBlock.transactions.length > 0) {
            const transactionsDetails = await Promise.all(
              newBlock.transactions.map((txHash: string) => testClient.getTransaction({ hash: txHash as Hash })),
            );
            newBlock.transactions = transactionsDetails;
          }

          const relevantTransactions = newBlock.transactions.filter(
            (tx: Transaction) => tx.from === address || tx.to === address,
          );

          relevantTransactions.forEach((tx: Transaction) => decodeTransactionData(tx));

          const receipts = await Promise.all(
            relevantTransactions.map(async (tx: Transaction) => {
              const receipt = await testClient.getTransactionReceipt({ hash: tx.hash });
              return { [tx.hash]: receipt };
            }),
          );

          setFilteredTransactions(prev => [...relevantTransactions, ...prev.slice(0, BLOCKS_PER_PAGE - 1)]);
          setTransactionReceipts(prevReceipts => ({ ...prevReceipts, ...Object.assign({}, ...receipts) }));
        }
        if (newBlock.number) {
          setTotalBlocks(newBlock.number);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred fetching the new block."));
      }
    };

    const unsubscribe = testClient.watchBlocks({
      onBlock: handleNewBlock,
      includeTransactions: true,
    });

    return () => unsubscribe();
  }, [currentPage, address]);

  // Fetch initial blocks when the hook is first used
  useEffect(() => {
    if (!address) {
      setError(new Error("Non valid address."));
      return;
    }
    fetchBlocks();
  }, [fetchBlocks, address]);

  return {
    filteredTransactions,
    transactionReceipts,
    currentPage,
    totalBlocks,
    setCurrentPage,
    error,
  };
};
