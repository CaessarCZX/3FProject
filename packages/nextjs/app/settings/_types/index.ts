export interface WithdrawalWallet {
  wallet: string;
  isActive: boolean;
  isUsable: boolean;
  releaseDate: string;
  updateDate: string;
}

export interface UserResponse {
  email_beneficiary?: string | undefined;
  name_beneficiary?: string | undefined;
  withdrawalWallet?: WithdrawalWallet;
}
