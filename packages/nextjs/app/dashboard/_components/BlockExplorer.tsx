"use client";

import { useEffect, useState } from "react";
import { TransactionsTable } from "./TransactionsTable";
import { useFetchTransactions } from "~~/hooks/3FProject/useFetchTransactions";
// import { PaginationButton } from "./PaginationButton";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { notification } from "~~/utils/scaffold-eth";

type BlockExplorerAddress = {
  address: string | undefined;
};

const BlockExplorer = ({ address }: BlockExplorerAddress) => {
  // const { filteredTransactions, transactionReceipts, currentPage, totalBlocks, setCurrentPage, error } =
  //   useFetchFilteredBlocks(address);
  const { transactions, isLoading, error } = useFetchTransactions(address);
  const { targetNetwork } = useTargetNetwork();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (error) {
      setHasError(true);
    }
  }, [targetNetwork.id, error]);

  useEffect(() => {
    if (hasError) {
      notification.error(
        <>
          <p className="font-bold mt-0 mb-1">Cannot connect to network provider</p>
          <p className="m-0">
            - Please <code className="italic bg-base-300 text-base font-bold">Reload Page</code>
          </p>
          <p className="mt-1 break-normal">
            - Or <code className="italic bg-base-300 text-base font-bold">Try again later</code> in{" "}
          </p>
        </>,
      );
    }
  }, [hasError]);

  return (
    <div className="container mx-auto rounded-xl overflow-hidden">
      {isLoading ? <p>Loading Data</p> : <TransactionsTable transactions={transactions} />}
      {/* <PaginationButton currentPage={currentPage} totalItems={Number(totalBlocks)} setCurrentPage={setCurrentPage} /> */}
    </div>
  );
};

export default BlockExplorer;
