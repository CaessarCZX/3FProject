import { useGlobalState } from "~~/services/store/store";

export const useGetMemberStatus = () => {
  const memberStatus = useGlobalState(state => state.memberStatus.active);
  const isMemberStatusFetching = useGlobalState(state => state.memberStatus.isFetching);
  return { memberStatus: memberStatus, isLoading: isMemberStatusFetching };
};
