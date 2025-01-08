import { useGlobalState } from "~~/services/store/store";

export const useGetMemberBalance = () => {
  const balance = useGlobalState(state => state.memberBalance.balance);
  return balance || 0;
};
