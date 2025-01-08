import { useGetTokenData } from "./useGetTokenData";

export const useMemberBalance = () => {
  const { tokenInfo } = useGetTokenData();

  return tokenInfo?.balance || null;
};
