import { useCallback } from "react";
import { useDeployedContractInfo } from "../scaffold-eth/useDeployedContractInfo";
import { useAccount, useChainId } from "wagmi";
import { useGlobalState } from "~~/services/store/store";
import { fetchMemberTransactions } from "~~/utils/3FContract/fetchMemberTransactions";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

export const useGetMemberTransactions = () => {
  const currentMember = useAccount();
  const setIsMemberTransactionsFetching = useGlobalState(state => state.setIsMemberTransactionsFetching);
  const setMemberTransactions = useGlobalState(state => state.setMemberTransactions);
  const chainId = useChainId();
  const url = getAlchemyHttpUrl(chainId) ?? "0x";
  const memberAddress = currentMember?.address ?? "0x";
  const { data: contract } = useDeployedContractInfo("FFFBusiness");
  const contractAddress = contract?.address ?? "0x";

  const fetchTransactions = useCallback(async () => {
    setIsMemberTransactionsFetching(true);
    const { transactions } = await fetchMemberTransactions(url, memberAddress, contractAddress);
    if (transactions) setMemberTransactions(transactions);
    setIsMemberTransactionsFetching(false);
  }, [setIsMemberTransactionsFetching, setMemberTransactions, url, memberAddress, contractAddress]);

  return { fetchTransactions };
};
