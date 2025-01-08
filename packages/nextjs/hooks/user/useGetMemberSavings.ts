import { useCallback, useState } from "react";
import { useGlobalState } from "~~/services/store/store";
import { fetchMemberSavings } from "~~/utils/Transactions/fetchMemberSavings";

// import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

export const useGetMemberSavings = () => {
  const setIsMemberSavingsFetching = useGlobalState(state => state.setIsMemberSavingsFetching);
  const setMemberSavings = useGlobalState(state => state.setMemberSavings);
  const setMemberBalance = useGlobalState(state => state.setMemberBalance);
  const [errorRequest, setErrorRequest] = useState("");

  const fetchSavings = useCallback(async () => {
    setIsMemberSavingsFetching(true);

    const { memberSavings, balance, error } = await fetchMemberSavings();

    if (error) {
      setIsMemberSavingsFetching(false);
      setErrorRequest(error);
      return;
    }

    if (memberSavings) setMemberSavings(memberSavings);
    if (balance) setMemberBalance(balance);

    setIsMemberSavingsFetching(false);
  }, [setIsMemberSavingsFetching, setMemberBalance, setMemberSavings]);

  return { fetchSavings, error: errorRequest };
};
