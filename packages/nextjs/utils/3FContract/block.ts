import { Transaction } from "viem";

export type TransactionsTableProps = {
  transactions: Transaction[];
};

export interface MemberTransaction {
  hash: string;
  value: string;
  timestamp: string;
  status: string;
}

export interface UseFetchTransactionsResult {
  transactions: MemberTransaction[] | null;
  isLoading: boolean;
  error: boolean;
}

export interface AlchemyTransaction {
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
