"use client";

import { useState } from "react";
import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";

export const TransactionHash = ({ hash, isSmallScreen }: { hash: string; isSmallScreen?: boolean }) => {
  const [addressCopied, setAddressCopied] = useState(false);

  return (
    <div className="flex items-center text-blue-600">
      <Link href={`/dashboard/transaction/${hash}`}>
        {!isSmallScreen
          ? `${hash?.substring(0, 6)}...${hash?.substring(hash.length - 4)}`
          : `${hash?.substring(0, 3)}...${hash?.substring(hash.length - 3)}`}
      </Link>
      {addressCopied ? (
        <CheckCircleIcon
          className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
          aria-hidden="true"
        />
      ) : (
        <CopyToClipboard
          text={hash as string}
          onCopy={() => {
            setAddressCopied(true);
            setTimeout(() => {
              setAddressCopied(false);
            }, 800);
          }}
        >
          <DocumentDuplicateIcon
            className={`ml-1.5 text-xl font-normal text-sky-600 ${
              isSmallScreen ? "h-3 w-3" : "h-5 w-5"
            } cursor-pointer`}
            aria-hidden="true"
          />
        </CopyToClipboard>
      )}
    </div>
  );
};
