export type DepositBtnProps = {
  depositAmount: string | null;
  btnText: string;
};

export type TransactionInfo = {
  allowanceHash: string | undefined;
  allowanceReceiptHash: string | undefined;
  depositContractHash: string | undefined;
  depositContractReceiptHash: string | undefined;
  error: string | undefined;
};
