import { useGlobalState } from "~~/services/store/store";

export const useSavings = () => {
  const savings = useGlobalState(state => state.memberSavings.transactions);
  return savings || null;
};
