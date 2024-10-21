import { Transaction } from "viem";

// type TransactionReceipts = {
//   [key: string]: TransactionReceipt;
// };

export type TransactionsTableProps = {
  transactions: Transaction[];
  // transactionReceipts: TransactionReceipts;
};
