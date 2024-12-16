import { useEffect } from "react";
import { useGetMemberTransactions } from "../user/useGetMemberTransactions";

export const useInitializeMemberTransactions = () => {
  const { fetchTransactions } = useGetMemberTransactions();

  useEffect(() => {
    // fetchTransactions();
  }, [fetchTransactions]);
};
