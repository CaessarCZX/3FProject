"use client";

import { useEffect, useState } from "react";
import { PaginationButton } from "./PaginationButton";
import { TransactionsTable } from "./TransactionsTable";
import { useFetchFilteredBlocks } from "~~/hooks/3FProject/useFetchFilteredBlocks";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { notification } from "~~/utils/scaffold-eth";

type BlockExplorerAddress = {
  address: string | undefined;
};

const BlockExplorer = ({ address }: BlockExplorerAddress) => {
  const { filteredTransactions, transactionReceipts, currentPage, totalBlocks, setCurrentPage, error } =
    useFetchFilteredBlocks(address);
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
      <TransactionsTable transactions={filteredTransactions} transactionReceipts={transactionReceipts} />
      <PaginationButton currentPage={currentPage} totalItems={Number(totalBlocks)} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default BlockExplorer;
