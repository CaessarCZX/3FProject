import { useGlobalState } from "~~/services/store/store";

export const useGetMemberStatus = () => {
  const memberStatus = useGlobalState(state => state.memberStatus.withMembership);
  return { memberStatus: memberStatus };
};
