import { useCallback, useState } from "react";
import { useGlobalState } from "~~/services/store/store";
import { fetchMemberSavings } from "~~/utils/Transactions/fetchMemberSavings";

// import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

export const useGetMemberSavings = () => {
  const setIsMemberSavingsFetching = useGlobalState(state => state.setIsMemberSavingsFetching);
  const setMemberSavings = useGlobalState(state => state.setMemberSavings);
  const [errorRequest, setErrorRequest] = useState("");

  const fetchSavings = useCallback(async () => {
    setIsMemberSavingsFetching(true);

    const { memberSavings, error } = await fetchMemberSavings();

    if (error) {
      setIsMemberSavingsFetching(false);
      setErrorRequest(error);
      return;
    }

    if (memberSavings) setMemberSavings(memberSavings);

    setIsMemberSavingsFetching(false);
  }, [setIsMemberSavingsFetching, setMemberSavings]);

  return { fetchSavings, error: errorRequest };
};
